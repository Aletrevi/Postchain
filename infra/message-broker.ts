import * as k8s from "@pulumi/kubernetes";

export function create(clusterProvider: k8s.Provider) {

    const messageBroker = new k8s.helm.v3.Chart(
        "message-broker",
        {
            chart: "rabbitmq",
            fetchOpts: {
                repo: "https://charts.bitnami.com/bitnami",
            },
            values: {

            }
        },
        {
            provider: clusterProvider,
        }
    );

    return messageBroker;
}
