#!/bin/bash
# Install Ubuntu Desktop GUI and RDP for VPS

echo "Installing Ubuntu Desktop and RDP..."

apt update
apt install -y ubuntu-desktop xrdp

systemctl enable xrdp
systemctl start xrdp
adduser xrdp ssl-cert

# Set root password for RDP login
echo "Set a password for RDP login:"
passwd root

# Allow RDP through firewall
ufw allow 3389

echo ""
echo "========================================"
echo "Desktop installation complete!"
echo "========================================"
echo ""
echo "Rebooting in 10 seconds..."
echo "After reboot, connect via Remote Desktop:"
echo "  - IP: $(curl -s ifconfig.me)"
echo "  - Port: 3389"
echo "  - User: root"
echo "  - Password: (the one you just set)"
echo ""
sleep 10
reboot
