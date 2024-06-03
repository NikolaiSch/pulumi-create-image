import { AwsMachineDefinitions, AwsVm } from "../src/aws/virtualMachine";

const awsConfig = {
  instanceType: "t2.micro",
  ami: "ami-0c55b159cbfafe1f0",
  amiOwner: "099720109477",
} satisfies AwsMachineDefinitions;

const myAwsVm = new AwsVm("nixos-vm", awsConfig, {});

export let awsVmIpAddress = myAwsVm.ipAddress;
