import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, LogOut, UploadCloud, Youtube } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

const GOOGLE_IDENTITY_SCRIPT_ID = 'google-identity-services-script';
const GOOGLE_IDENTITY_SRC = 'https://accounts.google.com/gsi/client';
const YOUTUBE_UPLOAD_SCOPE = 'https://www.googleapis.com/auth/youtube.upload';
const TOKEN_REFRESH_MARGIN_MS = 60 * 1000;

function loadGoogleIdentityScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(GOOGLE_IDENTITY_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Identity Services')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = GOOGLE_IDENTITY_SRC;
    script.id = GOOGLE_IDENTITY_SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
}

function titleFromFileName(fileName = '') {
  const withoutExtension = fileName.replace(/\.[^/.]+$/, '');
  return withoutExtension.slice(0, 100) || 'New upload';
}

async function beginResumableUpload({ accessToken, metadata, file }) {
  const startResponse = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Length': String(file.size),
      'X-Upload-Content-Type': file.type || 'application/octet-stream',
    },
    body: JSON.stringify(metadata),
  });

  if (!startResponse.ok) {
    const details = await startResponse.text();
    throw new Error(details || `Failed to start upload (${startResponse.status})`);
  }

  const uploadUrl = startResponse.headers.get('Location');
  if (!uploadUrl) {
    throw new Error('Upload session URL was not returned by YouTube.');
  }

  return uploadUrl;
}

function uploadVideoBinary({ uploadUrl, accessToken, file, onProgress }) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('PUT', uploadUrl, true);
    request.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    request.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

    request.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const percent = Math.round((event.loaded / event.total) * 100);
      onProgress(percent);
    };

    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        try {
          const parsed = JSON.parse(request.responseText);
          resolve(parsed);
        } catch (error) {
          reject(new Error('Upload finished but the response payload was invalid.'));
        }
      } else {
        reject(new Error(request.responseText || `Upload failed (${request.status})`));
      }
    };

    request.onerror = () => {
      reject(new Error('Network error while uploading video to YouTube.'));
    };

    request.send(file);
  });
}

export function YouTubeUploadPanel({ videoFile }) {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const tokenClientRef = useRef(null);

  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [tokenExpiresAt, setTokenExpiresAt] = useState(0);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacyStatus, setPrivacyStatus] = useState('unlisted');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [uploadedVideoId, setUploadedVideoId] = useState('');

  const canUpload = Boolean(videoFile && accessToken && isGoogleReady && !isUploading);
  const isTokenExpired = !accessToken || Date.now() + TOKEN_REFRESH_MARGIN_MS >= tokenExpiresAt;

  useEffect(() => {
    if (!videoFile) {
      setTitle('');
      return;
    }

    setTitle(titleFromFileName(videoFile.name));
  }, [videoFile]);

  useEffect(() => {
    let isCancelled = false;

    if (!googleClientId) {
      return () => {};
    }

    loadGoogleIdentityScript()
      .then(() => {
        if (isCancelled) return;
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: YOUTUBE_UPLOAD_SCOPE,
          callback: () => {},
        });
        setIsGoogleReady(true);
      })
      .catch((error) => {
        if (isCancelled) return;
        setUploadError(error.message || 'Google sign in failed to load.');
      });

    return () => {
      isCancelled = true;
    };
  }, [googleClientId]);

  const requestToken = useCallback((prompt) => {
    return new Promise((resolve, reject) => {
      if (!tokenClientRef.current) {
        reject(new Error('Google sign in is not ready yet.'));
        return;
      }

      tokenClientRef.current.callback = (tokenResponse) => {
        if (tokenResponse.error) {
          reject(new Error(tokenResponse.error_description || tokenResponse.error));
          return;
        }

        const expiresInMs = (tokenResponse.expires_in || 3600) * 1000;
        const expiresAt = Date.now() + expiresInMs;

        setAccessToken(tokenResponse.access_token);
        setTokenExpiresAt(expiresAt);
        resolve(tokenResponse.access_token);
      };

      tokenClientRef.current.requestAccessToken({ prompt });
    });
  }, []);

  const connectYouTube = async () => {
    setUploadError('');
    setUploadedVideoId('');
    setIsAuthorizing(true);

    try {
      await requestToken('consent');
    } catch (error) {
      setUploadError(error.message || 'Failed to sign in to Google.');
    } finally {
      setIsAuthorizing(false);
    }
  };

  const disconnectYouTube = () => {
    if (accessToken && window.google?.accounts?.oauth2?.revoke) {
      window.google.accounts.oauth2.revoke(accessToken, () => {});
    }

    setAccessToken(null);
    setTokenExpiresAt(0);
  };

  const uploadToYouTube = async () => {
    if (!videoFile) {
      setUploadError('Select a video first.');
      return;
    }

    setUploadError('');
    setUploadedVideoId('');
    setUploadProgress(0);
    setIsUploading(true);

    try {
      let token = accessToken;
      if (isTokenExpired) {
        try {
          token = await requestToken('');
        } catch (_refreshError) {
          token = await requestToken('consent');
        }
      }

      const metadata = {
        snippet: {
          title: (title || titleFromFileName(videoFile.name)).slice(0, 100),
          description: description.slice(0, 5000),
          categoryId: '22',
        },
        status: {
          privacyStatus,
        },
      };

      const uploadUrl = await beginResumableUpload({ accessToken: token, metadata, file: videoFile });
      const result = await uploadVideoBinary({
        uploadUrl,
        accessToken: token,
        file: videoFile,
        onProgress: setUploadProgress,
      });

      if (!result?.id) {
        throw new Error('Upload completed but no video id was returned.');
      }

      setUploadProgress(100);
      setUploadedVideoId(result.id);
    } catch (error) {
      setUploadError(error.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-xl">YouTube Upload</CardTitle>
            <CardDescription>Connect your Google account and publish the selected video.</CardDescription>
          </div>
          <Badge variant={accessToken ? 'default' : 'secondary'}>
            {accessToken ? 'Connected' : 'Not connected'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!googleClientId && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Missing `VITE_GOOGLE_CLIENT_ID` in your environment. Add it before using YouTube upload.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Video title</label>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={100}
              placeholder="My video title"
              disabled={!videoFile || isUploading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Visibility</label>
            <Select value={privacyStatus} onValueChange={setPrivacyStatus} disabled={isUploading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="unlisted">Unlisted</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={5000}
            placeholder="Write a short description"
            disabled={!videoFile || isUploading}
          />
        </div>

        {isUploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} />
            <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
          </div>
        )}

        {uploadedVideoId && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-700" />
            <AlertDescription className="text-green-900">
              Upload complete. Watch it on YouTube:{' '}
              <a
                href={`https://www.youtube.com/watch?v=${uploadedVideoId}`}
                target="_blank"
                rel="noreferrer"
                className="underline font-medium"
              >
                youtube.com/watch?v={uploadedVideoId}
              </a>
            </AlertDescription>
          </Alert>
        )}

        {uploadError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-wrap gap-2">
          {!accessToken ? (
            <Button onClick={connectYouTube} disabled={!isGoogleReady || !googleClientId || isAuthorizing}>
              {isAuthorizing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting
                </>
              ) : (
                <>
                  <Youtube className="mr-2 h-4 w-4" />
                  Connect YouTube
                </>
              )}
            </Button>
          ) : (
            <Button variant="outline" onClick={disconnectYouTube} disabled={isUploading}>
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          )}

          <Button onClick={uploadToYouTube} disabled={!canUpload}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload Video
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
