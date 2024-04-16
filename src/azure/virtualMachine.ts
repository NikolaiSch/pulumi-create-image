import * as azure_native from "@pulumi/azure-native"
import * as compute from "@pulumi/azure-native/compute"
import * as pulumi from "@pulumi/pulumi"
import { AzureNetwork } from "./network"

/**
 * MachineDefinitions describes the configuration options for a new virtual machine.
 *
 * ## required params
 * @param resourceGroupName The name of the resource group to create the VM in
 * @param region The region to create the VM in
 * @param username The username for the VM
 * @param password The password for the VM
 * @param imageReference The image reference for the VM
 * @param network The network definitions - see {@link AzureNetwork} for more details
 */
export interface MachineDefinitions {
  // required properties
  /** The name of the resource group you want the VM to be created in */
  resourceGroupName: string
  /** The region you want the VM to be created in */
  region: "westeurope" | string
  /** The username for the VM */
  username: string
  /** The password for the VM */
  password: string
  /** The image reference for the VM, of the format: "/subscriptions/cdfae013-f7e9-4b74-84b6-8e0a9f2a9ff4/resourceGroups/nixos-group/providers/Microsoft.Compute/images/nixos-image" */
  imageReference: string
  /** The network definitions - see {@link AzureNetwork} */
  network: AzureNetwork
}

/**
 * AzureVm is a resource component that creates a virtual machine in Azure
 * using the provided network definitions.
 *
 * ## required params
 * @param name The name of the component
 * @param cOpts The machine definitions - see {@link MachineDefinitions}
 * @param opts The pulumi component options
 *
 * ## public properties
 * @property ipAddress - The public IP address of the VM
 * @property computer - The OS profile of the VM
 * @property username - The username for the VM
 * @property password - The password for the VM
 *
 * @example
 * ```ts
 * let machine = new AzureVm(
 *  "nixos-vm",
 * {
 *   region: "westeurope",
 *   username: "testadmin1",
 *   password: "Password1234!",
 *   resourceGroupName: rgName,
 *   imageReference:
 *     "/subscriptions/cdfae013-f7e9-4b74-84b6-8e0a9f2a9ff4/resourceGroups/nixos-group/providers/Microsoft.Compute/images/nixos-image",
 *   network: network,
 * },
 * {})
 * ```
 */
export class AzureVm extends pulumi.ComponentResource {
  public ipAddress: pulumi.Output<string | undefined>
  public computer: pulumi.Output<
    azure_native.types.output.compute.OSProfileResponse | undefined
  >
  public username: string
  public password: string

  constructor(
    name: string,
    cOpts: MachineDefinitions,
    opts: pulumi.ComponentResourceOptions
  ) {
    super("nixos-setup:azure:vm", name, {}, opts)

    // Now create the VM, using the resource group and NIC allocated in NixosNetwork.
    let vm = new compute.VirtualMachine(
      "server-vm",
      {
        resourceGroupName: cOpts.resourceGroupName,
        networkProfile: {
          networkInterfaces: [
            {
              id: cOpts.network.networkId,
            },
          ],
        },
        hardwareProfile: {
          vmSize: compute.VirtualMachineSizeTypes.Standard_B1s,
        },
        osProfile: {
          computerName: "nixos-machine",
          adminUsername: cOpts.username,
          adminPassword: cOpts.password,
          linuxConfiguration: {
            disablePasswordAuthentication: false,
          },
        },
        storageProfile: {
          imageReference: {
            id: cOpts.imageReference,
          },
          osDisk: {
            caching: azure_native.compute.CachingTypes.ReadWrite,
            createOption: azure_native.compute.DiskCreateOptionTypes.FromImage,
            managedDisk: {
              storageAccountType:
                azure_native.compute.StorageAccountTypes.Standard_LRS,
            },
            // name: "myVMosdisk",
          },
        },
        zones: ["2"],
      },
      {
        parent: this,
      }
    )

    this.ipAddress = cOpts.network.publicIPAddress
    this.computer = vm.osProfile
    this.username = cOpts.username
    this.password = cOpts.password

    this.registerOutputs({
      ipAddress: cOpts.network.publicIPAddress,
      host: vm.osProfile,
      username: cOpts.username,
      password: cOpts.password,
    })
  }
}
