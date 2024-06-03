import { AzureNetwork, type AzureNetworkDefinitions } from "./network";
import { type AzureMachineDefinitions, AzureVm } from "./virtualMachine";

export { AzureNetwork, AzureVm };

export type {
  AzureMachineDefinitions as AzureVmDefinitions,
  AzureNetworkDefinitions as AzureNetworkDefinitions,
};
