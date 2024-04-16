import * as azure_native from "@pulumi/azure-native"
import * as compute from "@pulumi/azure-native/compute"
import * as pulumi from "@pulumi/pulumi"
import { NixosNetwork } from "./network"

interface MachineDefinitions {
  resourceGroupName: string

  region: "westeurope" | string
  username: string
  password: string

  imageReference: string

  network: NixosNetwork
}

export class NixosVm extends pulumi.ComponentResource {
  public IpAddress: pulumi.Output<string | undefined>
  public Computer: pulumi.Output<
    azure_native.types.output.compute.OSProfileResponse | undefined
  >
  public Username: string
  public Password: string

  constructor(
    name: string,
    cOpts: MachineDefinitions,
    opts: pulumi.ComponentResourceOptions
  ) {
    super("pkg:index:nixos-vm", name, {}, opts)

    // Now create the VM, using the resource group and NIC allocated above.
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
          // computerName: "hostname",
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

    this.IpAddress = cOpts.network.publicIPAddress
    this.Computer = vm.osProfile
    this.Username = cOpts.username
    this.Password = cOpts.password

    this.registerOutputs({
      ipAddress: cOpts.network.publicIPAddress,
      host: vm.osProfile,
      username: cOpts.username,
      password: cOpts.password,
    })
  }
}
