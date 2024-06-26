import { nixosCloudConfig } from "./cloudConfig";

const shared = {
  x86: {
    /** 1 intel vcpu, 2GB ram, 20GB disk space, 20TB traffic, locations: Germany, Finland; €4.55 p/m */
    CX11: "cx11",
    /** 2 amd vcpu, 2GB ram, 40GB disk space, 20TB traffic, locations: Germany, Finland, USA; €5.22 p/m */
    CPX11: "cpx11",
    /** 2 intel vcpu, 4GB ram, 40GB disk space, 20TB traffic, locations: Germany, Finland; €6.42 p/m */
    CX21: "cx21",
    /** 3 amd vcpu, 4GB ram, 80GB disk space, 20TB traffic, locations: Germany, Finland, USA; €9.06 p/m */
    CPX21: "cpx21",
    /** 2 intel vcpu, 8GB ram, 80GB disk space, 20TB traffic, locations: Germany, Finland; €11.64 p/m */
    CX31: "cx31",
    /** 4 amd vcpu, 8GB ram, 160GB disk space, 20TB traffic, locations: Germany, Finland, USA; €16.32 p/m */
    CPX31: "cpx31",
    /** 4 intel vcpu, 16GB ram, 160GB disk space, 20TB traffic, locations: Germany, Finland; €20.88 p/m */
    CX41: "cx41",
    /** 8 amd vcpu, 16GB ram, 240GB disk space, 20TB traffic, locations: Germany, Finland, USA; €30.24 p/m */
    CPX41: "cpx41",
    /** 8 intel vcpu, 32GB ram, 240GB disk space, 20TB traffic, locations: Germany, Finland; €39.48 p/m */
    CX51: "cx51",
    /** 16 amd vcpu, 32GB ram, 480GB disk space, 20TB traffic, locations: Germany, Finland, USA; €65.88 p/m */
    CPX51: "cpx51",
  },
  arm: {
    /** 2 Ampere vcpu, 4GB ram, 40GB disk space, 20TB traffic, locations: Germany, Finland; €4.55 p/m */
    CAX11: "cax11",
    /** 4 Ampere vcpu, 8GB ram, 80GB disk space, 20TB traffic, locations: Germany, Finland; €7.78 p/m */
    CAX21: "cax21",
    /** 8 Ampere vcpu, 16GB ram, 160GB disk space, 20TB traffic, locations: Germany, Finland; €14.98 p/m */
    CAX31: "cax31",
    /** 16 Ampere vcpu, 32GB ram, 240GB disk space, 20TB traffic, locations: Germany, Finland; €29.38 p/m */
    CAX41: "cax41",
  },
};

const dedicated = {
  /** 2 amd vcpu, 8GB ram, 80GB disk space, 20TB traffic, locations: Germany, Finland, USA; €14.98 p/m */
  CCX13: "ccx13",
  /** 4 amd vcpu, 16GB ram, 160GB disk space, 20TB traffic, locations: Germany, Finland, USA; €29.38 p/m */
  CCX23: "ccx23",
  /** 8 amd vcpu, 32GB ram, 240GB disk space, 20TB traffic, locations: Germany, Finland, USA; €58.18 p/m */
  CCX33: "ccx33",
  /** 16 amd vcpu, 64GB ram, 360GB disk space, 20TB traffic, locations: Germany, Finland, USA; €115.78 p/m */
  CCX43: "ccx43",
  /** 32 amd vcpu, 128GB ram, 600GB disk space, 20TB traffic, locations: Germany, Finland, USA; €230.98 p/m */
  CCX53: "ccx53",
  /** 48 amd vcpu, 192GB ram, 960GB disk space, 20TB traffic, locations: Germany, Finland, USA; €346.18 p/m */
  CCX63: "ccx63",
};

export const HetznerServerTypes = {
  dedicated,
  shared,
};

export const HetznerLocations = {
  Germany: "nbg1",
  Finland: "hel1",
  USA: "ewr1",
};

export const HetznerCloudConfig = {
  nixos: nixosCloudConfig,
};

export const HetznerCloudImage = {
  /** Os images, e.g. debian, ubuntu, centos, rocky, almalinux, fedora, etc. */
  os: {
    debian_10: "debian-10",
    debian_11: "debian-11",
    debian_12: "debian-12",

    ubuntu_20_04: "ubuntu-20.04",
    ubuntu_22_04: "ubuntu-22.04",
    ubuntu_24_04: "ubuntu-24.04",

    centos_stream_8: "centos-stream-8",
    centos_stream_9: "centos-stream-9",

    rocky_8: "rocky-8",
    rocky_9: "rocky-9",

    almalinux_8: "alma-8",
    almalinux_9: "alma-9",

    fedora_38: "fedora-38",
    fedora_39: "fedora-39",
    fedora_40: "fedora-40",
  },
  /** App images, e.g. lamp, wordpress, jitsi,  gitlab, etc. */
  app: {
    lamp: "lamp",
    wordpress: "wordpress",
    jitsi: "jitsi",
    nextcloud: "nextcloud",
    docker_ce: "docker-ce",
    gitlab: "gitlab",
    ruby: "ruby",
    go: "go",
    prometheus_grafana: "prometheus-grafana",
    collab_tools: "collab-tools",
    wireguard: "wireguard",
    owncast: "owncast",
    photoprism: "photoprism",
    rustdesk: "rustdesk",
  },
};
