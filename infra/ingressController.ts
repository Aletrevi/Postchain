import * as k8s from "@pulumi/kubernetes";

export function create(clusterProvider: k8s.Provider) {

    const kongIngress = new k8s.helm.v3.Chart(
        "kong-ingress", 
        {
            chart: "kong",
            version: "1.24.4",
            fetchOpts:{
                repo: "https://charts.konghq.com",
            },
            values: {

            }
        },
        {
            provider: clusterProvider,
        }
    );

    let svc = kongIngress.getResource('v1/Service', "platform/kong-ingress-kong-proxy")

    return kongIngress;
}
