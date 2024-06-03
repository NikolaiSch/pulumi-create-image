import * as hcloud from "@pulumi/hcloud";
import * as pulumi from "@pulumi/pulumi";

export interface HetznerMachineDefinitions {
  serverType: hcloud.ServerArgs["serverType"];
  location: hcloud.ServerArgs["datacenter"];
  image: hcloud.ServerArgs["image"];
  pubSSHKeys: string[];
}

export class HetznerVm extends pulumi.ComponentResource {
  constructor(
    name: string,
    cOpts: HetznerMachineDefinitions,
    opts: pulumi.ComponentResourceOptions,
  ) {
    super("nixos-setup:hetzner:vm", name, {}, opts);

    const keys = cOpts.pubSSHKeys.map((key) => {
      return new hcloud.SshKey(name, {
        name: `${name}-sshkey-${key.slice(0, 8)}`,
        publicKey: key,
      });
    });

    const server = new hcloud.Server(name, {
      name: name,
      image: cOpts.image,
      serverType: cOpts.serverType,
      datacenter: cOpts.location,
      sshKeys: keys.map((key) => key.id),
    });

    this.registerOutputs({
      ipv4Address: server.ipv4Address,
      ipv6Address: server.ipv6Address,
      primaryDiskSize: server.primaryDiskSize,
    });
  }
}
