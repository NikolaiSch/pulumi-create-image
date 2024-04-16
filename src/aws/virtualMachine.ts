import * as aws from "@pulumi/aws"
import * as pulumi from "@pulumi/pulumi"

/**
 * MachineDefinitions defines the properties of the machine to be created.
 *
 * @param instanceType The instance type to create
 * @param ami The AMI to use - e.g. "ami-0c55b159cbfafe1f0"
 * @param amiOwner The owner of the AMI - e.g. "099720109477"
 *
 */
export interface MachineDefinitions {
  instanceType: aws.ec2.InstanceType
  ami: string
  amiOwner: string
}

/**
 * AwsVm is a resource component that creates a virtual machine in AWS
 * using the provided machine definitions.
 *
 * @param name The name of the component
 * @param cOpts The machine definitions - see {@link MachineDefinitions}
 * @param opts The pulumi component options
 *
 * @property ipAddress - The public IP address of the VM
 *
 * @example
 * ```ts
 * let machine = new AwsVm(
 * "nixos-vm",
 * {
 *  instanceType: "t2.micro",
 *  ami: "ami-0c55b159cbfafe1f0",
 *  amiOwner: "099720109477",
 * })
 */
export class AwsVm extends pulumi.ComponentResource {
  public ipAddress: string | undefined

  constructor(
    name: string,
    cOpts: MachineDefinitions,
    opts: pulumi.ComponentResourceOptions
  ) {
    super("nixos-setup:aws:vm", name, {}, opts)

    const ami = aws.ec2.getAmi(
      {
        filters: [
          {
            name: "image-id",
            values: [cOpts.ami],
          },
        ],
        owners: [cOpts.amiOwner],
        mostRecent: true,
      },
      { async: false, parent: this }
    )

    // Create a VPC
    const vpc = new aws.ec2.Vpc("myVpc", {
      cidrBlock: "10.0.0.0/16",
    })

    // Create a public subnet within the VPC
    const subnet = new aws.ec2.Subnet(
      "mySubnet",
      {
        vpcId: vpc.id,
        cidrBlock: "10.0.1.0/24",
        mapPublicIpOnLaunch: true, // This enables instances in this subnet to be assigned a public IP
      },
      { parent: this }
    )

    // Create a security group that allows SSH access
    const sg = new aws.ec2.SecurityGroup(
      "mySecurityGroup",
      {
        vpcId: vpc.id,
        ingress: [
          {
            protocol: "tcp",
            fromPort: 22,
            toPort: 22,
            cidrBlocks: ["0.0.0.0/0"],
          },
        ],
      },
      { parent: this }
    )

    ami.then((ami) => {
      let ec2 = new aws.ec2.Instance(
        "myInstance",
        {
          instanceType: cOpts.instanceType,
          ami: ami.id,
          subnetId: subnet.id,
          vpcSecurityGroupIds: [sg.id],
          associatePublicIpAddress: true,
        },
        { parent: this }
      )

      ec2.publicIp.apply((x) => (this.ipAddress = x))
    })
  }
}
