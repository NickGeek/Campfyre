# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "larryli/utopic32"
  config.vm.provision :shell, :path => "vagrant_setup.sh"
  config.vm.network :forwarded_port, :host => 58249, :guest => 80
end
