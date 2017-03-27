export interface GitHubProfile {
  login: string;
  id: number;
  html_url: string;
  // ... https://developer.github.com/v3/users/#get-the-authenticated-user
}

export function redirectToAuthorize() {
  // Start the OAuth flow.
  window.location.href = 'https://github.com/login/oauth/authorize?client_id=7cab785292b3c26051a4&scope=gist';
}

export function checkForOAuthCode(loggedInCallback: () => any) {
  const qs = window.location.search;
  const m = qs.search(/^code=(.*)/);
  if (!m) return;
  const code = m[1];

}

export async function getUserProfile(): Promise<GitHubProfile> {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) return Promise.reject('Not logged in.');

  const response = await fetch('//api.github.com/user', {
    headers: {
      'Authorization': `token ${accessToken}`
    }
  });
  return response.json();
}

export function logout() {
  // ...
}