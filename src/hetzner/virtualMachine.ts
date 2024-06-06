import * as hcloud from "@pulumi/hcloud";
import * as pulumi from "@pulumi/pulumi";

/**
 * HetznerMachineDefinitions describes the configuration options for a new Hetzner VM.
 *
 * ## required params
 * @param serverType The server type to create
 * @param location The location to create the VM in
 * @param image The image to use for the VM
 * @param pubSSHKeys The public SSH keys to use for the VM
 *
 * @example
 * ```ts
 * let machine = new HetznerVm(
 * "nixos-vm",
 * {
 *  serverType: "cx11",
 *  location: "nbg1",
 *  image: "ubuntu-20.04",
 *  pubSSHKeys: ["ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC3..."],
 * },
 * {})
 * ```
 */
export interface HetznerMachineDefinitions {
  serverType: string;
  location: string;
  image: string;
  pubSSHKeys: string[];
  cloudConfig?: string;
}

/**
 * HetznerVm is a resource component that creates a virtual machine in Hetzner
 * using the provided machine definitions.
 *
 * ## required params
 * @param name The name of the component
 * @param cOpts The machine definitions - see {@link HetznerMachineDefinitions}
 * @param opts The pulumi component options
 *
 * ## component outputs
 * @param ipv4Address - The public IPv4 address of the VM
 * @param ipv6Address - The public IPv6 address of the VM
 * @param primaryDiskSize - The size of the primary disk of the VM
 *
 * @example
 * ```ts
 * let machine = new HetznerVm(
 * "nixos-vm",
 * {
 *  serverType: "cx11",
 *  location: "nbg1",
 *  image: "ubuntu-20.04",
 *  pubSSHKeys: ["ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC3..."],
 * },
 * {})
 * ```
 */
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
      }, { parent: this });
    });

    const server = new hcloud.Server(name, {
      name: name,
      image: cOpts.image,
      serverType: cOpts.serverType,
      datacenter: cOpts.location,
      sshKeys: keys.map((key) => key.id),
      userData: cOpts.cloudConfig,
    }, {
      parent: this,
    });

    this.registerOutputs({
      ipv4Address: server.ipv4Address,
      ipv6Address: server.ipv6Address,
      primaryDiskSize: server.primaryDiskSize,
    });
  }
}
