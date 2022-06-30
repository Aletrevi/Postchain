import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as ingressController from "./ingressController";
import * as service from "./service";
import * as prometheusOperator from "./prometheusOperator";

const name = "helloworld";

// Create a GKE cluster
const engineVersion = gcp.container.getEngineVersions().then(v => v.latestMasterVersion);
const cluster = new gcp.container.Cluster(name, {
  initialNodeCount: 2,
  minMasterVersion: engineVersion,
  nodeVersion: engineVersion,
  nodeConfig: {
    machineType: "n1-standard-1",
    oauthScopes: [
      "https://www.googleapis.com/auth/compute",
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring"
    ],
  },
});

// Export the Cluster name
export const clusterName = cluster.name;

// Manufacture a GKE-style kubeconfig. Note that this is slightly "different"
// because of the way GKE requires gcloud to be in the picture for cluster
// authentication (rather than using the client cert/key directly).
export const kubeconfig = pulumi.
  all([cluster.name, cluster.endpoint, cluster.masterAuth]).
  apply(([name, endpoint, masterAuth]) => {
    const context = `${gcp.config.project}_${gcp.config.zone}_${name}`;
    return `apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${masterAuth.clusterCaCertificate}
    server: https://${endpoint}
  name: ${context}
contexts:
- context:
    cluster: ${context}
    user: ${context}
  name: ${context}
current-context: ${context}
kind: Config
preferences: {}
users:
- name: ${context}
  user:
    auth-provider:
      config:
        cmd-args: config config-helper --format=json
        cmd-path: gcloud
        expiry-key: '{.credential.token_expiry}'
        token-key: '{.credential.access_token}'
      name: gcp
`;
  });

// Create a Kubernetes provider instance that uses our cluster from above.
const clusterProvider = new k8s.Provider(name, {
  kubeconfig: kubeconfig,
});

let ingressIntance = ingressController.create(clusterProvider)
// let prometheusOperatorInstance = prometheusOperator.create(clusterProvider)

let postService = service.create(
  clusterProvider,
  "post",
  9232,
  "aletrevi/post:0.8",
  [
    {
      name: "RABBITMQ_USER",
      value: "admin"
    },
    {
      name: "RABBITMQ_PASSWORD",
      value: "admin"
    },
    {
      name: "RABBITMQ_HOST",
      value: "message-broker"
    },
    {
      name: "RABBITMQ_PORT",
      value: "5672"
    },
    {
      name: "RABBITMQ_POST_SERVICE_EVENTS_QUEUE_NAME",
      value: "post_service.events"
    },
    {
      name: "RABBITMQ_POST_SERVICE_TRIGGERS_QUEUE_NAME",
      value: "post_service.triggers"
    },
  ]
)

let checkerService = service.create(
  clusterProvider,
  "checker",
  9234,
  "aletrevi/checker:0.8",
  [
    {
      name: "RABBITMQ_USER",
      value: "admin"
    },
    {
      name: "RABBITMQ_PASSWORD",
      value: "admin"
    },
    {
      name: "RABBITMQ_HOST",
      value: "message-broker"
    },
    {
      name: "RABBITMQ_PORT",
      value: "5672"
    },
    {
      name: "RABBITMQ_CHECKER_SERVICE_EVENTS_QUEUE_NAME",
      value: "checker_service.events"
    },
    {
      name: "RABBITMQ_CHECKER_SERVICE_TRIGGERS_QUEUE_NAME",
      value: "checker_service.triggers"
    },
  ]
)

let orchestratorService = service.create(
  clusterProvider,
  "orchestrator",
  3001,
  "aletrevi/orchestrator:0.8",
  [
    {
      name: "PORT",
      value: "3001"
    },
    {
      name: "RABBITMQ_USER",
      value: "admin"
    },
    {
      name: "RABBITMQ_PASSWORD",
      value: "admin"
    },
    {
      name: "RABBITMQ_HOST",
      value: "message-broker"
    },
    {
      name: "RABBITMQ_PORT",
      value: "5672"
    },
    {
      name: "RABBITMQ_POST_SERVICE_EVENTS_QUEUE_NAME",
      value: "post_service.events"
    },
    {
      name: "RABBITMQ_POST_SERVICE_TRIGGERS_QUEUE_NAME",
      value: "post_service.triggers"
    },
    {
      name: "RABBITMQ_CHECKER_SERVICE_EVENTS_QUEUE_NAME",
      value: "checker_service.events"
    },
    {
      name: "RABBITMQ_CHECKER_SERVICE_TRIGGERS_QUEUE_NAME",
      value: "checker_service.triggers"
    },
    {
      name: "RABBITMQ_BC_INTERACTOR_SERVICE_EVENTS_QUEUE_NAME",
      value: "bc_interactor.events"
    },
    {
      name: "RABBITMQ_BC_INTERACTOR_SERVICE_TRIGGERS_QUEUE_NAME",
      value: "bc_interactor.triggers"
    },
    {
      name: "RABBITMQ_QUEUE_NAME",
      value: "orchestrator_service.triggers"
    },
  ]
)
let blockchainInteractorService = service.create(
  clusterProvider,
  "blockchain-interactor",
  3001,
  "aletrevi/blockchain-interactor:0.8",
  [
    {
      name: "PORT",
      value: "3001"
    },
    {
      name: "RABBITMQ_USER",
      value: "admin"
    },
    {
      name: "RABBITMQ_PASSWORD",
      value: "admin"
    },
    {
      name: "RABBITMQ_HOST",
      value: "message-broker"
    },
    {
      name: "RABBITMQ_PORT",
      value: "5672"
    },
    {
      name: "RABBITMQ_BLOCKCHAIN_INTERACTOR_SERVICE_EVENTS_QUEUE_NAME",
      value: "bc_interactor.events"
    },
    {
      name: "RABBITMQ_BLOCKCHAIN_INTERACTOR_SERVICE_TRIGGERS_QUEUE_NAME",
      value: "bc_interactor.triggers"
    },
    {
      name: "WALLET_PRIVATE_KEY",
      value: "75bcf91780b2504638144a4f6f9337a56738bba07cbb2f256d461a870ed495bc"
    },
    {
      name: "WALLET_ADDRESS",
      value: "0xD0a9a942a4e8680F94bED892fcb277eB67B3B337"
    },
    {
      name: "INFURA_TOKEN",
      value: "87047500d3194aa397371f52c1178504"
    },
    {
      name: "INFURA_URL",
      value: "https://rinkeby.infura.io/v3"
    },
    {
      name: "ETHERSCAN_URL",
      value: "https://rinkeby.etherscan.io/tx"
    }
  ]
)



// // Create a Kubernetes Namespace
// const ns = new k8s.core.v1.Namespace(name, {}, { provider: clusterProvider });

// // Export the Namespace name
// export const namespaceName = ns.metadata.apply(m => m.name);

// // Create a NGINX Deployment
// const appLabels = { appClass: name };
// const deployment = new k8s.apps.v1.Deployment(name,
//     {
//         metadata: {
//             namespace: namespaceName,
//             labels: appLabels,
//         },
//         spec: {
//             replicas: 1,
//             selector: { matchLabels: appLabels },
//             template: {
//                 metadata: {
//                     labels: appLabels,
//                 },
//                 spec: {
//                     containers: [
//                         {
//                             name: name,
//                             image: "nginx:latest",
//                             ports: [{ name: "http", containerPort: 80 }]
//                         }
//                     ],
//                 }
//             }
//         },
//     },
//     {
//         provider: clusterProvider,
//     }
// );

// // Export the Deployment name
// export const deploymentName = deployment.metadata.apply(m => m.name);

// // Create a LoadBalancer Service for the NGINX Deployment
// const service = new k8s.core.v1.Service(name,
//     {
//         metadata: {
//             labels: appLabels,
//             namespace: namespaceName,
//         },
//         spec: {
//             type: "LoadBalancer",
//             ports: [{ port: 80, targetPort: "http" }],
//             selector: appLabels,
//         },
//     },
//     {
//         provider: clusterProvider,
//     }
// );

// // Export the Service name and public LoadBalancer endpoint
// export const serviceName = service.metadata.apply(m => m.name);
// export const servicePublicIP = service.status.apply(s => s.loadBalancer.ingress[0].ip)



// docker build -f docker/dockerfile.develop . -t aletrevi/<nome>:<versione> -t <nome>:<versione>
// docker push aletrevi/<nome>:<versione>