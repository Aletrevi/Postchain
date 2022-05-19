import * as k8s from "@pulumi/kubernetes";

export function create(clusterProvider: k8s.Provider) {

  const prometheusOperator = new k8s.helm.v3.Chart(
    "prometheus-operator",
    {
      chart: "mesosphere/prometheus-operator",
      fetchOpts: {
        repo: "https://mesosphere.github.io/charts/staging",
        version: "12.11.13",
      },
      values: {

      }
    },
    {
      provider: clusterProvider,
    }
  );

  // let svc = kongIngress.getResource('v1/Service', "platform/kong-ingress-kong-proxy")

  return prometheusOperator;
}
