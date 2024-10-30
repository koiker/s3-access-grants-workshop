import * as React from "react";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Link from "@cloudscape-design/components/link";
import Button from "@cloudscape-design/components/button";
import KeyValuePairs from "@cloudscape-design/components/key-value-pairs";
import CopyToClipboard from "@cloudscape-design/components/copy-to-clipboard";

function Settings() {

    return ( <ContentLayout
            defaultPadding
            headerVariant="high-contrast"
            header={
                <Header
                    variant="h1"
                    info={<Link variant="info">Info</Link>}
                    description="This is the application configuration settings."
                    actions={
                        <Button variant="primary"
                                onClick={() => {window.location.href = "/";}}
                        >Back</Button>
                    }
                >
                    Settings
                </Header>
            }
        >
            <Container
                header={
                    <Header variant="h2">Configuration Settings</Header>
                }
            >
                <KeyValuePairs
                    items={[
                        {
                            label: "AUDIENCE",
                            value: (
                                <CopyToClipboard
                                    copyButtonAriaLabel="Copy AUDIENCE"
                                    copyErrorText="AUDIENCE failed to copy"
                                    copySuccessText="AUDIENCE copied"
                                    textToCopy={window.AUDIENCE}
                                    variant="inline"
                                />
                            )
                        },
                        {
                            label: "ISSUER",
                            value: (
                                <CopyToClipboard
                                    copyButtonAriaLabel="Copy ISSUER"
                                    copyErrorText="ISSUER failed to copy"
                                    copySuccessText="ISSUER copied"
                                    textToCopy={window.ISSUER}
                                    variant="inline"
                                />
                            )
                        },
                        {
                            label: "API_ENDPOINT",
                            value: (
                                <CopyToClipboard
                                    copyButtonAriaLabel="Copy API_ENDPOINT"
                                    copyErrorText="API_ENDPOINT failed to copy"
                                    copySuccessText="API_ENDPOINT copied"
                                    textToCopy={window.API_ENDPOINT}
                                    variant="inline"
                                />
                            )
                        }
                    ]}
                />
            </Container>
        </ContentLayout>
    );
}

export default Settings;
