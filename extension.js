/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const GETTEXT_DOMAIN = 'my-indicator-extension';

const { GLib, GObject, St } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const _ = ExtensionUtils.gettext;

let PID = null;

const Indicator = GObject.registerClass(
  class Indicator extends PanelMenu.Button {
    _init() {
      super._init(0.0, _('My Shiny Indicator'));

      this.add_child(new St.Icon({
        icon_name:  'input-keyboard-symbolic',
        style_class: 'system-status-icon',
      }));

      let item = new PopupMenu.PopupMenuItem(_('Disable keyboard'));
      item.connect('activate', () => {
        if (PID) {
          GLib.spawn_close_pid(PID);
          GLib.spawn_command_line_async(`pkexec kill ${PID}`);
          PID = null;
          Main.notify('Keyboard enabled');
          item.label.text = _('Disable keyboard')
          return;
        }

        const [ok, pid] = GLib.spawn_async(
          null,
          ['pkexec', 'evtest', '--grab', '/dev/input/event3', '>', '/dev/null'],
          null,
          4,
          data => data,
        );

        if (!ok) {
          Main.notify("There was a problem disabling keyboard");
        } else if (pid) {
          PID = pid;
          item.label.text = _('Enable keyboard')
          Main.notify(`Keyboard disabled, pid: ${PID}`);
        }
      });
      this.menu.addMenuItem(item);
    }
  });

class Extension {
  constructor(uuid) {
    this._uuid = uuid;

    ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
  }

  enable() {
    this._indicator = new Indicator();
    Main.panel.addToStatusArea(this._uuid, this._indicator);
  }

  disable() {
    this._indicator.destroy();
    this._indicator = null;
  }
}

function init(meta) {
  return new Extension(meta.uuid);
}
