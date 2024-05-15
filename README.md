KB on/off
---

This plugin adds an icon to the gnome bar with a button to enable/disable the keyboard while using Wayland.

## Install
To install this plugin go to `$HOME/.local/share/gnome-shell/extensions/` and clone this repo:

```bash
cd $HOME/.local/share/gnome-shell/extensions
git clone https://github.com/ggmenendez/kbonoff.git kbonoff@thenutbreaker.xyz
```

After that, logout and login again and it should be added. If it isn't, check if it is enabled from the Gnome Extensions app (`gnome-shell-extension-prefs`)

## Uninstall
Just remove the directory of the plugin and logout then login.

```bash
rm -rf $HOME/.local/share/gnome-shell/extensions/kbonoff@thenutbreaker.xyz
```
