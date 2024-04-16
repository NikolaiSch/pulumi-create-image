// Copyright 2016-2020, Pulumi Corporation.  All rights reserved.
import * as azure_native from "@pulumi/azure-native"
import * as fs from "fs"
import { NixosNetwork } from "./network"
import { NixosVm } from "./virtualMachine"

let rgName = "nixos-group"

let resourceGroup = new azure_native.resources.ResourceGroup(rgName, {
  location: "westeurope",
}).name

let network = new NixosNetwork(
  "nixos-network",
  {
    resourceGroupName: rgName,
    region: "westeurope",
  },
  {}
)

let machine = new NixosVm(
  "nixos-vm",
  {
    region: "westeurope",
    username: "testadmin",
    password: "Password1234!",
    resourceGroupName: rgName,
    imageReference:
      "/subscriptions/cdfae013-f7e9-4b74-84b6-8e0a9f2a9ff4/resourceGroups/nixos-group/providers/Microsoft.Compute/images/nixos-image",

    network: network,
  },
  {}
)

// fs.writeFileSync(
//   "./out.json",
//   JSON.stringify(
//     {
//       machine: {
//         ipAddress: machine.IpAddress.get(),
//         computer: machine.Computer.get(),
//         username: machine.Username,
//         password: machine.Password,
//       },
//     },
//     null,
//     2
//   )
// )

let json = JSON.stringify(
  {
    machine: {
      ipAddress: machine.IpAddress.apply((ip) => ip),
      computer: machine.Computer.apply((comp) => comp),
      username: machine.Username,
      password: machine.Password,
    },
  },
  null,
  2
)

fs.writeFileSync("./out.json", json)

export { machine }
