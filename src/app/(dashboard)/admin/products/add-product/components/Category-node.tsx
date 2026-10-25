"use client";

import {
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShirt,
  faHouse,
  faBasketShopping,
  faMobileScreenButton,
  faCar,
  faUtensils,
  faGamepad,
  faDumbbell,
  faBook,
  faGift,
  faPlane,
  faLaptop,
  faBaby,
  faHeart,
  faScrewdriverWrench,
  faPaw,
  faMusic,
  faCamera,
  faCouch,
  faGem,
} from "@fortawesome/free-solid-svg-icons";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type CategoryNodeData = {
  id: string;
  name: string;
  icon?: string;
  children: CategoryNodeData[];
};

type Props = {
  node: CategoryNodeData;
  depth: number;

  onUpdateName: (id: string, name: string) => void;

  onUpdateIcon: (id: string, icon: string) => void;

  onAddChild: (parentId: string) => void;

  onRemove: (id: string) => void;

  isRoot?: boolean;
};

const CATEGORY_ICONS: {
  name: string;
  label: string;
  icon: IconDefinition;
}[] = [
  {
    name: "shirt",
    label: "Fashion",
    icon: faShirt,
  },
  {
    name: "house",
    label: "Home",
    icon: faHouse,
  },
  {
    name: "basket-shopping",
    label: "Grocery",
    icon: faBasketShopping,
  },
  {
    name: "mobile-screen-button",
    label: "Electronics",
    icon: faMobileScreenButton,
  },
  {
    name: "car",
    label: "Automotive",
    icon: faCar,
  },
  {
    name: "utensils",
    label: "Food",
    icon: faUtensils,
  },
  {
    name: "gamepad",
    label: "Gaming",
    icon: faGamepad,
  },
  {
    name: "dumbbell",
    label: "Sports",
    icon: faDumbbell,
  },
  {
    name: "book",
    label: "Books",
    icon: faBook,
  },
  {
    name: "gift",
    label: "Gifts",
    icon: faGift,
  },
  {
    name: "plane",
    label: "Travel",
    icon: faPlane,
  },
  {
    name: "laptop",
    label: "Computers",
    icon: faLaptop,
  },
  {
    name: "baby",
    label: "Baby",
    icon: faBaby,
  },
  {
    name: "heart",
    label: "Health & Care",
    icon: faHeart,
  },
  {
    name: "screwdriver-wrench",
    label: "Tools",
    icon: faScrewdriverWrench,
  },
  {
    name: "paw",
    label: "Pet",
    icon: faPaw,
  },
  {
    name: "music",
    label: "Music",
    icon: faMusic,
  },
  {
    name: "camera",
    label: "Photography",
    icon: faCamera,
  },
  {
    name: "couch",
    label: "Furniture",
    icon: faCouch,
  },
  {
    name: "gem",
    label: "Jewelry",
    icon: faGem,
  },
];

function getIconDefinition(
  iconName?: string
): IconDefinition | null {
  if (!iconName) return null;

  return (
    CATEGORY_ICONS.find(
      (item) => item.name === iconName
    )?.icon ?? null
  );
}

export function CategoryNode({
  node,
  depth,
  onUpdateName,
  onUpdateIcon,
  onAddChild,
  onRemove,
  isRoot = false,
}: Props) {
  const [expanded, setExpanded] = useState(true);

  const [iconPickerOpen, setIconPickerOpen] =
    useState(false);

  const hasChildren = node.children.length > 0;

  const selectedIcon = getIconDefinition(node.icon);

  return (
    <div
      style={{
        marginLeft: depth === 0 ? 0 : 20,
      }}
    >
      <div className="flex items-center gap-2 py-1.5">
        {/* Expand / Collapse */}
        <button
          type="button"
          onClick={() =>
            setExpanded((e) => !e)
          }
          className={`text-slate-400 ${
            hasChildren ? "" : "invisible"
          }`}
        >
          {expanded ? (
            <ChevronDown size={15} />
          ) : (
            <ChevronRight size={15} />
          )}
        </button>

        {/* Category name */}
        <input
          type="text"
          value={node.name}
          onChange={(e) =>
            onUpdateName(
              node.id,
              e.target.value
            )
          }
          placeholder={
            depth === 0
              ? "Main category name"
              : "Subcategory name"
          }
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-amber-500"
        />

        {/* MAIN CATEGORY ONLY — ICON */}
        {isRoot && (
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setIconPickerOpen(
                  (open) => !open
                )
              }
              className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 text-slate-600 transition hover:border-amber-400 hover:bg-amber-50"
              title="Choose category icon"
            >
              {selectedIcon ? (
                <FontAwesomeIcon
                  icon={selectedIcon}
                  className="h-4 w-4"
                />
              ) : (
                <span className="text-[11px] text-slate-400">
                  Icon
                </span>
              )}

              <ChevronDown size={12} />
            </button>

            {iconPickerOpen && (
              <div className="absolute right-0 top-10 z-50 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800">
                    Choose Icon
                  </p>

                  {node.icon && (
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateIcon(
                          node.id,
                          ""
                        );
                        setIconPickerOpen(false);
                      }}
                      className="text-[10px] font-semibold text-rose-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid max-h-56 grid-cols-5 gap-1.5 overflow-y-auto">
                  {CATEGORY_ICONS.map(
                    (item) => {
                      const active =
                        node.icon ===
                        item.name;

                      return (
                        <button
                          key={item.name}
                          type="button"
                          title={item.label}
                          onClick={() => {
                            onUpdateIcon(
                              node.id,
                              item.name
                            );

                            setIconPickerOpen(
                              false
                            );
                          }}
                          className={`flex h-10 w-10 items-center justify-center rounded-lg border transition ${
                            active
                              ? "border-amber-500 bg-amber-50 text-amber-600"
                              : "border-slate-100 text-slate-500 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600"
                          }`}
                        >
                          <FontAwesomeIcon
                            icon={item.icon}
                            className="h-4 w-4"
                          />
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add child */}
        <button
          type="button"
          onClick={() =>
            onAddChild(node.id)
          }
          className="flex items-center gap-1 whitespace-nowrap text-[11px] font-semibold text-amber-600 hover:underline"
        >
          <Plus size={13} />
          Subcategory
        </button>

        {/* Remove */}
        <button
          type="button"
          onClick={() =>
            onRemove(node.id)
          }
          className="text-slate-400 hover:text-rose-500"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div className="border-l border-slate-200 pl-2">
          {node.children.map(
            (child) => (
              <CategoryNode
                key={child.id}
                node={child}
                depth={depth + 1}
                isRoot={false}
                onUpdateName={
                  onUpdateName
                }
                onUpdateIcon={
                  onUpdateIcon
                }
                onAddChild={
                  onAddChild
                }
                onRemove={onRemove}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}