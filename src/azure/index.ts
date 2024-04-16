import { AzureNetwork, type NetworkDefinitions } from "./network"
import { AzureVm, type MachineDefinitions } from "./virtualMachine"

export { AzureNetwork, AzureVm }

export type {
  NetworkDefinitions as AzureNetworkDefinitions,
  MachineDefinitions as AzureVmDefinitions,
}
