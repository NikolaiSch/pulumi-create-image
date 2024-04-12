// Copyright 2016-2020, Pulumi Corporation.  All rights reserved.

import * as azure_native from "@pulumi/azure-native"
import * as compute from "@pulumi/azure-native/compute"
import * as network from "@pulumi/azure-native/network"
import * as resources from "@pulumi/azure-native/resources"

interface MachineDefinitions {
  region: "westeurope" | string
  username: string
  password: string

  resourceGroupName: string
  vnetName: string
  subnetName: string
  publicIPName: string
  nicName: string
  vmName: string

  vmSize: compute.VirtualMachineSizeTypes
}

export function createMachine({
  region,
  username,
  password,
  resourceGroupName,
  vnetName,
  subnetName,
  publicIPName,
  nicName,
  vmName,
  vmSize,
}: MachineDefinitions) {
  // All resources will share a resource group.
  const rgName = new resources.ResourceGroup(resourceGroupName).name

  const virtualNetwork = new azure_native.network.VirtualNetwork("nixos-vnet", {
    addressSpace: {
      addressPrefixes: ["10.0.0.0/16"],
    },
    flowTimeoutInMinutes: 10,
    location: region,
    resourceGroupName: rgName,
    virtualNetworkName: "test-nixos-vnet",
  })

  const subnet = new azure_native.network.Subnet("nixos-subnet", {
    addressPrefix: "10.0.0.0/16",
    virtualNetworkName: virtualNetwork.name,
    resourceGroupName: resourceGroupName,
    subnetName: "test-nixos-subnet",
  })

  const publicIPAddress = new azure_native.network.PublicIPAddress(
    "publicIPAddress",
    {
      dnsSettings: {
        domainNameLabel: "dnslbl",
      },
      location: region,
      publicIpAddressName: "test-ip",
      publicIPAllocationMethod: network.IPAllocationMethod.Static,
      resourceGroupName: resourceGroupName,
      zones: ["2"],
      sku: {
        name: network.PublicIPAddressSkuName.Standard,
        tier: network.PublicIPAddressSkuTier.Regional,
      },
    }
  )

  const networkInterface = new azure_native.network.NetworkInterface(
    "networkInterface",
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
      location: region,
      networkInterfaceName: "test-nixos-nic",
      resourceGroupName: resourceGroupName,
    }
  )

  // Now create the VM, using the resource group and NIC allocated above.
  new compute.VirtualMachine("server-vm", {
    resourceGroupName,
    networkProfile: {
      networkInterfaces: [
        {
          id: networkInterface.id,
        },
      ],
    },
    hardwareProfile: {
      vmSize: compute.VirtualMachineSizeTypes.Standard_B1s,
    },
    osProfile: {
      computerName: "hostname",
      adminUsername: username,
      adminPassword: password,
      linuxConfiguration: {
        disablePasswordAuthentication: false,
      },
    },
    storageProfile: {
      imageReference: {
        id: "/subscriptions/cdfae013-f7e9-4b74-84b6-8e0a9f2a9ff4/resourceGroups/nixos-group/providers/Microsoft.Compute/images/nixos-vii",
      },
      osDisk: {
        caching: azure_native.compute.CachingTypes.ReadWrite,
        createOption: azure_native.compute.DiskCreateOptionTypes.FromImage,
        managedDisk: {
          storageAccountType:
            azure_native.compute.StorageAccountTypes.Standard_LRS,
        },
        name: "myVMosdisk",
      },
    },
    zones: ["2"],
  })
}

export const publicIP = publicIPAddress.ipAddress
