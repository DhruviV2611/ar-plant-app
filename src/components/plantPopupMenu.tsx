import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { SVG } from '../constant/svg'; // Update this path as needed

interface Props {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const PlantActionMenu: React.FC<Props> = ({ onView, onEdit, onDelete }) => {
  return (
    <Menu>
      <MenuTrigger
        customStyles={{
          TriggerTouchableComponent: TouchableOpacity,
          triggerWrapper: styles.triggerWrapper,
        }}
      >
        <SvgXml xml={SVG.ACTION_MENU} width="24" height="24" />
      </MenuTrigger>

      <MenuOptions customStyles={{ optionsWrapper: styles.optionsWrapper }}>
        <MenuOption onSelect={onView} style={styles.menuOption}>
            <SvgXml xml={SVG.DETAILS_VIEW} width="24" height="24" />
          <Text style={styles.menuText}>View</Text>
        </MenuOption>
        <MenuOption onSelect={onEdit} style={styles.menuOption}>
          <SvgXml xml={SVG.EDIT} width="24" height="24" />
          <Text style={styles.menuText}>Edit</Text>
        </MenuOption>
        <MenuOption onSelect={onDelete} style={styles.menuOption}>
          <SvgXml xml={SVG.DELETE} width="24" height="24" />
          <Text style={styles.menuText}>Delete</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  triggerWrapper: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsWrapper: {
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
  },
  menuOption: {
    flexDirection: 'row',  
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#999',
  },
});

export default PlantActionMenu;
