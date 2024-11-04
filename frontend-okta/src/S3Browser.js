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
    const [locations, setLocations] = useState([]);
    const [credentials, setCredentials] = useState({});

    function fetchGrants(authState) {
        if( !authState ) {
            return [];
        }
        fetch(api_endpoint + 'ListGrants', {
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
                setLocations(response.response.map( location => ({
                    bucketName: location.GrantScope,
                    key: '',
                    region: 'us-east-1',
                    type: 'BUCKET',
                    permission: location.Permission,
                    scope: location.GrantScope,
                })))
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
            await oktaAuth.token.renewTokens().then(renewToken => {
                oktaAuth.tokenManager.setTokens(renewToken);
                fetch(api_endpoint + 'FetchCredentials?' + new URLSearchParams(params), {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Authorization': authState.accessToken.accessToken
                    },
                }).then(data => data.json()).then(data => {
                    setCredentials( {
                        AccessKeyId: data.response.Credentials.AccessKeyId,
                        SecretAccessKey: data.response.Credentials.SecretAccessKey,
                        SessionToken: data.response.Credentials.SessionToken,
                        Expiration: data.response.Credentials.Expiration});
                })
            });
            return credentials;

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setCredentials({AccessKeyId: '', SecretAccessKey: '', SessionToken: '', Expiration: ''});
        }
    }
    useEffect(() => {
        // Fetch data when the component mounts
        if(locations === undefined || locations.length === 0){
            // fetchGrants(authState);
            setLocations([{
                bucketName: 's3://koike-s3ag',
                key: '',
                region: 'us-east-1',
                type: 'BUCKET',
                permission: 'READWRITE',
                scope: 's3://koike-s3ag/*',
            }]);
        }
    }, [authState])

    const { StorageBrowser } = createStorageBrowser({
        elements: elementsDefault, // replace to customize your UI
        config: {
            listLocations: async (input = {}) => {
                const { nextToken, pageSize } = input;
                return {
                    locations: locations
                }
            },
            getLocationCredentials: async ({ scope, permission }) => {
                await fetchCredentials(scope, permission);
                console.log(credentials);
                return credentials;
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
