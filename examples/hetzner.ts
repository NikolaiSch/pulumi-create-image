import {
  HetznerLocations,
  HetznerMachineDefinitions,
  HetznerServerTypes,
  HetznerVm,
} from "../src";

const myConfig = {
  image: "ubuntu-20.04",
  location: HetznerLocations.Germany,
  pubSSHKeys: ["ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC3..."],
  serverType: HetznerServerTypes.shared.x86.CX11,
} satisfies HetznerMachineDefinitions;

const myHetznerVm = new HetznerVm("nixos-vm", myConfig, {});
