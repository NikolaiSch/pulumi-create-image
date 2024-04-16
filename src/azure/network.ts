import * as azure_native from "@pulumi/azure-native"
import * as network from "@pulumi/azure-native/network"
import * as pulumi from "@pulumi/pulumi"

/**
 * NetworkDefinitions is a set of properties that describe the network to be created
 *
 * ## required params
 * @param resourceGroupName The name of the resource group to create the network in
 * @param region The region to create the network in
 *
 * ## optional params
 * @param vnetName The name of the virtual network to create
 * @param subnetName The name of the subnet to create
 * @param publicIpName The name of the public IP to create
 * @param nicName The name of the network interface to create
 */
export interface NetworkDefinitions {
  // required properties
  /** The name of the resource group you want the network to be created in */
  resourceGroupName: string
  /** The region you want the network to be created in */
  region: "westeurope" | string

  // optional properties
  /** The name of the virtual network you want to create - defaults to `nixos-vnet` */
  vnetName?: string
  /** The name of the subnet you want to create - defaults to `nixos-subnet` */
  subnetName?: string
  /** The name of the public IP you want to create - defaults to `nixos-public-ip` */
  publicIpName?: string
  /** The name of the network interface you want to create - defaults to `nixos-nic` */
  nicName?: string
}

/**
 * AzureNetwork is a component that creates a virtual network, subnet, public IP, and network interface
 * for a NixOS virtual machine
 *
 * ## required params
 * @param name The name of the component
 * @param cOpts The network definitions - see {@link NetworkDefinitions}
 * @param opts The pulumi component options
 *
 * ## public properties
 * @property networkId - The ID of the network interface
 * @property publicIPAddress - The public IP address of the network interface
 * @property vnetName - The name of the virtual network
 * @property subnetName - The name of the subnet
 * @property publicIpName - The name of the public IP
 * @property nicName - The name of the network interface
 *
 * @example
 * ```ts
 * let network = new AzureNetwork("nixos-network", {
 *  resourceGroupName: "resource-group",
 *  region: "westeurope",
 * }, {});
 * ```
 */
export class AzureNetwork extends pulumi.ComponentResource {
  vnetName: string
  subnetName: string
  publicIpName: string
  nicName: string
  resourceGroupName: string

  networkId: pulumi.Output<string>
  publicIPAddress: pulumi.Output<string | undefined>

  constructor(
    name: string,
    cOpts: NetworkDefinitions,
    opts: pulumi.ComponentResourceOptions
  ) {
    super("pkg:index:nixos-network", name, {}, opts)

    this.vnetName = cOpts.vnetName || "nixos-vnet"
    this.subnetName = cOpts.subnetName || "nixos-subnet"
    this.publicIpName = cOpts.publicIpName || "nixos-public-ip"
    this.nicName = cOpts.nicName || "nixos-nic"
    this.resourceGroupName = cOpts.resourceGroupName

    // create the virtual network
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

    // create the subnet
    const subnet = new azure_native.network.Subnet(
      cOpts.subnetName || "nixos-subnet",
      {
        addressPrefix: "10.0.0.0/16",
        virtualNetworkName: virtualNetwork.name,
        resourceGroupName: cOpts.resourceGroupName,
      },
      { parent: this }
    )

    // create the public IP address
    const publicIPAddress = new azure_native.network.PublicIPAddress(
      cOpts.publicIpName || "nixos-public-ip",
      {
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

    // set the public IP address property, so others can access it
    this.publicIPAddress = publicIPAddress.ipAddress

    // create the network interface
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

    // set the network interface ID property, so others can access it
    this.networkId = networkInterface.id

    // register the outputs
    this.registerOutputs({
      virtualNetwork,
      subnet,
      publicIPAddress,
      networkInterface,
    })
  }
}
