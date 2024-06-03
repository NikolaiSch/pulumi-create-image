import { HetznerMachineDefinitions, HetznerVm } from "../src";

const myConfig = {
  image: "ubuntu-20.04",
  location: "nbg1",
  pubSSHKeys: ["ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC3..."],
  serverType: "cx11",
} satisfies HetznerMachineDefinitions;

const myHetznerVm = new HetznerVm("nixos-vm", myConfig, {});
