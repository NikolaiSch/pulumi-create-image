import {
  HetznerCloudConfig,
  HetznerCloudImage,
  HetznerLocations,
  HetznerMachineDefinitions,
  HetznerServerTypes,
  HetznerVm,
} from "../src";

const myConfig = {
  image: HetznerCloudImage.os.debian_12,
  location: HetznerLocations.Germany,
  serverType: HetznerServerTypes.shared.x86.CX11,
  cloudConfig: HetznerCloudConfig.nixos,

  pubSSHKeys: ["ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC3..."],
} satisfies HetznerMachineDefinitions;

const myHetznerVm = new HetznerVm("nixos-vm", myConfig, {});
