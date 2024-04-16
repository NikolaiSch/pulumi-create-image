import * as azure_native from "@pulumi/azure-native"
import * as pulumi from "@pulumi/pulumi"
import * as fs from "fs"
import { AzureNetwork, AzureVm } from "../src"

// what is the name of the resource group?
let rgName = "nixos-group"

// where should the everything be created?
let location = "westeurope"

// what is the login details to the vm?
let username = "testadmin1"
let password = "Password1234!"

// what image should we use?
let imageReference =
  "/subscriptions/cdfae013-f7e9-4b74-84b6-8e0a9f2a9ff4/resourceGroups/nixos-group/providers/Microsoft.Compute/images/nixos-image"

// create the resource group with our name
new azure_native.resources.ResourceGroup(rgName, {
  location,
}).name

// create the network for the virtual machine
let network = new AzureNetwork(
  "nixos-network",
  {
    resourceGroupName: rgName,
    region: location,
  },
  {}
)

// create the virtual machine, using the network we created
let machine = new AzureVm(
  "nixos-vm",
  {
    region: location,
    username,
    password,
    resourceGroupName: rgName,
    imageReference,
    network: network,
  },
  {}
)

pulumi.all([machine.ipAddress, machine.computer]).apply(([ip, computer]) => {
  // write the output to a string as json
  let json = JSON.stringify(
    {
      machine: {
        ipAddress: ip,
        computer: computer,
        username: machine.username,
        password: machine.password,
      },
    },
    null,
    2
  )

  // write the json to a file
  fs.writeFileSync("./out.json", json)
})

// export the machine for pulumi to show details
export { machine }
