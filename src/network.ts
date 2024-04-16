import * as azure_native from "@pulumi/azure-native"
import * as network from "@pulumi/azure-native/network"
import * as pulumi from "@pulumi/pulumi"
interface MachineDefinitions {
  resourceGroupName: string
  region: "westeurope" | string

  // optional properties
  vnetName?: string
  subnetName?: string
  publicIpName?: string
  nicName?: string
}

export class NixosNetwork extends pulumi.ComponentResource {
  vnetName: string
  subnetName: string
  publicIpName: string
  nicName: string
  resourceGroupName: string

  networkId: pulumi.Output<string>
  publicIPAddress: pulumi.Output<string | undefined>

  constructor(
    name: string,
    cOpts: MachineDefinitions,
    opts: pulumi.ComponentResourceOptions
  ) {
    super("pkg:index:nixos-network", name, {}, opts)

    this.vnetName = cOpts.vnetName || "nixos-vnet"
    this.subnetName = cOpts.subnetName || "nixos-subnet"
    this.publicIpName = cOpts.publicIpName || "nixos-public-ip"
    this.nicName = cOpts.nicName || "nixos-nic"
    this.resourceGroupName = cOpts.resourceGroupName

    const virtualNetwork = new azure_native.network.VirtualNetwork(
      this.vnetName,
      {
        addressSpace: {
          addressPrefixes: ["10.0.0.0/16"],
        },
        flowTimeoutInMinutes: 10,
        location: cOpts.region,
        resourceGroupName: cOpts.resourceGroupName,
      },
      {
        parent: this,
      }
    )

    const subnet = new azure_native.network.Subnet(
      cOpts.subnetName || "nixos-subnet",
      {
        addressPrefix: "10.0.0.0/16",
        virtualNetworkName: virtualNetwork.name,
        resourceGroupName: cOpts.resourceGroupName,
      },
      { parent: this }
    )

    const publicIPAddress = new azure_native.network.PublicIPAddress(
      cOpts.publicIpName || "nixos-public-ip",
      {
        // dnsSettings: {
        //   domainNameLabel: "dnslbl",
        // },
        location: cOpts.region,
        publicIpAddressName: "test-ip",
        publicIPAllocationMethod: network.IPAllocationMethod.Static,
        resourceGroupName: cOpts.resourceGroupName,
        zones: ["2"],
        sku: {
          name: network.PublicIPAddressSkuName.Standard,
          tier: network.PublicIPAddressSkuTier.Regional,
        },
      },
      {
        parent: this,
      }
    )

    this.publicIPAddress = publicIPAddress.ipAddress

    const networkInterface = new azure_native.network.NetworkInterface(
      cOpts.nicName || "nixos-nic",
      {
        ipConfigurations: [
          {
            name: "ipconfig1",
            publicIPAddress: {
              id: publicIPAddress.id,
            },
            subnet: {
              id: subnet.id,
            },
          },
        ],
        location: cOpts.region,
        resourceGroupName: cOpts.resourceGroupName,
      },
      {
        parent: this,
      }
    )

    this.networkId = networkInterface.id

    this.registerOutputs({
      virtualNetwork,
      subnet,
      publicIPAddress,
      networkInterface,
    })
  }
}
