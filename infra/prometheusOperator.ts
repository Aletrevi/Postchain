import * as k8s from "@pulumi/kubernetes";

export function create(clusterProvider: k8s.Provider) {

  // const prometheusOperator = new k8s.helm.v3.Chart(
  //   "prometheus-operator",
  //   {
  //     chart: "prometheus-community/kube-prometheus-stack",
  //     fetchOpts: {
  //       repo: "https://prometheus-community.github.io/helm-charts",
  //     },
  //     values: {

  //     }
  //   },
  //   {
  //     provider: clusterProvider,
  //   }
  // );

  // let svc = kongIngress.getResource('v1/Service', "platform/kong-ingress-kong-proxy")

  const prometheusOperator = new k8s.yaml.ConfigFile("Prometheus-operator", {
    file: "bundle.yaml"
  })

  return prometheusOperator;
}
