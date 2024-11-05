import React, {useEffect, useState} from 'react';
import ContentLayout from "@cloudscape-design/components/content-layout";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Link from "@cloudscape-design/components/link";
import Button from "@cloudscape-design/components/button";
import {createStorageBrowser, elementsDefault} from '@aws-amplify/ui-react-storage/browser';
import '@aws-amplify/ui-react-storage/storage-browser-styles.css';
import {useOktaAuth} from "@okta/okta-react";
import {api_endpoint} from "./config";

function S3Browser() {
    const {oktaAuth, authState} = useOktaAuth();

    function fetchGrants() {
        if( !authState ) {
            return [];
        }
        return fetch(api_endpoint + 'ListGrants', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Authorization': authState.accessToken.accessToken
            },
        },)
            .then(response => {
                if (!response.ok) {
                    let err = new Error('HTTP status code:' + response.status)
                    err.response = response
                    err.status = response.status
                    throw err
                }
                return response.json();
            })
            .then(response => {
                return response.response.map( location => ({
                    bucketName: location.GrantScope,
                    key: '',
                    region: 'us-east-1',
                    type: 'BUCKET',
                    permission: location.Permission,
                    scope: location.GrantScope,
                }))
            })
            .catch(error => {
                console.log(error);
            });
    }
    async function fetchCredentials(scope, permission) {
        const params = {
            Scope: scope,
            Permission: permission
        };
        try {
            const finalCredentials = await oktaAuth.token.renewTokens().then(renewToken => {
                return fetch(api_endpoint + 'FetchCredentials?' + new URLSearchParams(params), {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Authorization': renewToken.accessToken.accessToken
                    },
                }).then(data => data.json()).then(({ response }) => {
                  return {
                    accessKeyId: response.Credentials.AccessKeyId,
                    secretAccessKey: response.Credentials.SecretAccessKey,
                    sessionToken: response.Credentials.SessionToken,
                    expiration: new Date(response.Credentials.Expiration),
                  };
                })
            });
            return finalCredentials;

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    const { StorageBrowser } = createStorageBrowser({
        elements: elementsDefault, // replace to customize your UI
        config: {
            listLocations: async (input = {}) => {
                const locations = await fetchGrants();
                return { locations };
            },
            getLocationCredentials: async ({ scope, permission }) => {
                const finalCredentials = await fetchCredentials(scope, permission);
                return { credentials: finalCredentials };
            },
            region: 'us-east-1',
            registerAuthListener: (onStateChange) => {

            }
        },
    });

    return ( <ContentLayout
            defaultPadding
            headerVariant="high-contrast"
            header={
                <Header
                    variant="h1"
                    info={<Link variant="info">Info</Link>}
                    description="Browse S3 grants."
                    actions={
                        <Button variant="primary"
                                onClick={() => {window.location.href = "/";}}
                        >Back</Button>
                    }
                >
                    S3 Browser
                </Header>
            }
        >
            <Container
                header={
                    <Header variant="h2">Browser</Header>
                }
            >

                <StorageBrowser />
            </Container>
        </ContentLayout>
    );
}

export default S3Browser;
