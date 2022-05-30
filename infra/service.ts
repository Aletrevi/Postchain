import * as k8s from "@pulumi/kubernetes";
import { Output } from "@pulumi/pulumi";

export function create(clusterProvider: k8s.Provider, name: string, port: number, image: string, env_variables: any[]) {
    const appLabels = {
        appClass: name,
    };

    const namespace = createNamespace(clusterProvider, name);
    const deployment = createDeployment(clusterProvider, name, namespace, appLabels, port, image, env_variables)
    const service = createService(clusterProvider, name, appLabels, namespace)
    const ingress = createIngress(clusterProvider, name)
}

function createNamespace(clusterProvider: k8s.Provider, name: string) {
    const ns = new k8s.core.v1.Namespace(
        name,
        {},
        {
            provider: clusterProvider,
        }
    );
    return ns.metadata.apply(m => m.name);
}


function createDeployment(clusterProvider: k8s.Provider, name: string, namespaceName: Output<string>, appLabels: { appClass: string; }, port: number, image: string, env_variables: any[]) {
    const deployment = new k8s.apps.v1.Deployment(
        name,
        {
            metadata: {
                namespace: namespaceName,
                labels: appLabels,
            },
            spec: {
                replicas: 1,
                selector: { matchLabels: appLabels },
                template: {
                    metadata: {
                        labels: appLabels,
                    },
                    spec: {
                        containers: [
                            {
                                name: name,
                                image: image,
                                ports: [
                                    {
                                        name: "http",
                                        containerPort: port,
                                    }
                                ],
                                env: env_variables
                            }
                        ],
                    }
                }
            }
        },
        {
            provider: clusterProvider,
        }
    )

    return deployment.metadata.apply(m => m.name);
}

function createService(clusterProvider: k8s.Provider, name: string, appLabels: { appClass: string; }, namespaceName: Output<string>) {
    const service = new k8s.core.v1.Service(
        name,
        {
            metadata: {
                labels: appLabels,
                namespace: namespaceName,
            },
            spec: {
                type: "ClusterIP",
                ports: [{
                    port: 80,
                    targetPort: "http",
                }]
            }
        },
        {
            provider: clusterProvider
        }
    )

    return service.metadata.apply(m => m.name);
}

function createIngress(clusterProvider: k8s.Provider, name: string) {
    const ingress = new k8s.networking.v1.Ingress(
        name,
        {
            metadata: {
                annotations: {
                    "nginx.ingress.kubernetes.io/rewrite-target": "/", // USELESS. Keep for reference
                },
            },
            spec: {
                rules: [{
                    http: {
                        paths: [{
                            path: `/${name}`,
                            pathType: "Prefix",
                            backend: {
                                service: {
                                    name: name,
                                    port: {
                                        number: 80,
                                    },
                                },
                            },
                        }],
                    },
                }],
            },
        },
        {
            provider: clusterProvider,
        }
    )

    return ingress.metadata.apply(m => m.name)
}