import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Pressable, SectionList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SECTIONS = [
  {
    title: "Layout",
    data: ["text", "view", "separator", "scroll-view", "avoid-keyboard"],
  },
  {
    title: "Media",
    data: ["icon", "image", "link"],
  },
  {
    title: "Form",
    data: [
      "button",
      "input",
      "checkbox",
      "switch",
      "radio",
      "toggle",
      "input-otp",
      "searchbar",
      "mode-toggle",
    ],
  },
  {
    title: "Display",
    data: ["badge", "card", "avatar", "skeleton", "progress", "spinner", "alert"],
  },
  {
    title: "Navigation",
    data: ["tabs", "carousel", "onboarding"],
  },
  {
    title: "Overlays",
    data: [
      "picker",
      "combobox",
      "date-picker",
      "popover",
      "action-sheet",
      "bottom-sheet",
      "sheet",
      "alert-dialog",
      "toast",
    ],
  },
  {
    title: "Content",
    data: ["accordion", "collapsible", "table"],
  },
];

const DESCRIPTIONS: Record<string, string> = {
  text: "6 variants: heading, title, subtitle, body, caption, link",
  view: "Transparent background View wrapper",
  separator: "Horizontal or vertical divider",
  "scroll-view": "forwardRef ScrollView with transparent bg",
  "avoid-keyboard": "Animated spacer that grows with keyboard",
  icon: "lucide-react-native with themed color defaults",
  image: "expo-image wrapper with error state + fallback",
  link: "expo-router Link with in-app browser support",
  button: "7 variants, 4 sizes, spring animation, haptics",
  input: "label, error, hint, icon, filled/outline variants",
  checkbox: "Checked state, label, error, disabled",
  switch: "Animated toggle with label",
  radio: "RadioGroup + RadioButton, vertical/horizontal",
  toggle: "Press-toggle, default/outline, sm/default/lg",
  "input-otp": "Hidden TextInput + visual slots, masked mode",
  searchbar: "Debounced search, clear button, loading state",
  "mode-toggle": "Dark/light mode toggle, Sun/Moon icons",
  badge: "5 variants: default, secondary, destructive, outline, success",
  card: "Card/Header/Title/Description/Content/Footer",
  avatar: "expo-image with initials fallback",
  skeleton: "Pulsing placeholder, default/rounded, Reanimated",
  progress: "Animated fill bar 0–100, Reanimated withTiming",
  spinner: "5 variants: default, circle, dots, pulse, bars",
  alert: "5 variants: default, info, warning, destructive, success",
  tabs: "Compound Tabs/TabsList/TabsTrigger/TabsContent",
  carousel: "FlatList horizontal pager, dots, arrows, gap",
  onboarding: "Multi-step pager, dots, Next/Done/Skip",
  picker: "Select dropdown via Modal, single/multi, searchable",
  combobox: "Searchable select, clearable, empty state",
  "date-picker": "Calendar grid modal, min/max, custom format",
  popover: "Floating panel, measures trigger, auto-flips",
  "action-sheet": "iOS-style action list, destructive/cancel",
  "bottom-sheet": "Draggable with snap points, PanResponder",
  sheet: "Slide-in panel from any side",
  "alert-dialog": "Modal confirm/cancel, dismissible backdrop",
  toast: "ToastProvider + useToast, 5 variants, auto-dismiss",
  accordion: "Single/multiple expand, collapsible, Reanimated",
  collapsible: "Title + chevron, show/hide children",
  table: "Compound table, horizontal scroll, width prop",
};

const TITLE_MAP: Record<string, string> = {
  "input-otp": "InputOTP",
  "alert-dialog": "AlertDialog",
  "avoid-keyboard": "AvoidKeyboard",
  "mode-toggle": "ModeToggle",
  "scroll-view": "ScrollView",
  "action-sheet": "ActionSheet",
  "bottom-sheet": "BottomSheet",
  "date-picker": "DatePicker",
};

function formatTitle(name: string): string {
  return (
    TITLE_MAP[name] ??
    name
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join("")
  );
}

export default function ComponentGallery() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-950">
      <View className="px-4 pt-6 pb-3">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          rn-ui
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          39 components · Expo + NativeWind
        </Text>
      </View>

      <SectionList
        sections={SECTIONS}
        keyExtractor={(item) => item}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <View className="px-4 pt-5 pb-1.5">
            <Text className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              {section.title}
            </Text>
          </View>
        )}
        renderItem={({ item, index, section }) => {
          const isFirst = index === 0;
          const isLast = index === section.data.length - 1;
          return (
            <Pressable
              onPress={() => router.push(`/component/${item}` as any)}
              className="flex-row items-center px-4 py-3 bg-white dark:bg-gray-950 active:bg-gray-50 dark:active:bg-gray-900"
              style={{
                borderTopLeftRadius: isFirst ? 12 : 0,
                borderTopRightRadius: isFirst ? 12 : 0,
                borderBottomLeftRadius: isLast ? 12 : 0,
                borderBottomRightRadius: isLast ? 12 : 0,
              }}
            >
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatTitle(item)}
                </Text>
                {DESCRIPTIONS[item] && (
                  <Text
                    className="text-xs text-gray-400 dark:text-gray-500 mt-0.5"
                    numberOfLines={1}
                  >
                    {DESCRIPTIONS[item]}
                  </Text>
                )}
              </View>
              <ChevronRight size={15} color="#9ca3af" />
            </Pressable>
          );
        }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}
