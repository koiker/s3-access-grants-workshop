/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 * config.js
 * This had better be a single object written in JavaScript, if you like your job.
 * Polluting the global space with objects is not good citizenship.
 * Have a nice day.
 * -- Management
 *
 *
 * @version 0.1
 * @author  Rafael Koike, https://github.com/koiker
 * @updated 2024-05-20
 * @link    https://github.com/aws-samples/s3-access-grants-workshop
 *
 *
 */
let AUDIENCE = window.AUDIENCE || '<AUDIENCE>';
let ISSUER = window.ISSUER || 'https://dev-<DIRECTORY>.okta.com/oauth2/default';
const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);
// This is the Cloudfront URL generated by CDK deploy
let REDIRECT_URI = 'https://' + window.location.host + '/login/callback';
if (isLocalhost){
    // This URL can be used when testing locally
    REDIRECT_URI = 'http://localhost:3000/login/callback';
}
export const api_endpoint = window.API_ENDPOINT || "https://<API-ID>.execute-api.<REGION>.amazonaws.com/prod/";
export const oidcConfig = {
    clientId: AUDIENCE,
    issuer: ISSUER,
    redirectUri: REDIRECT_URI,
    scopes: ['openid', 'profile', 'email'],
};
