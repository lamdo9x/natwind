import React, { useState, useCallback, useRef } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text as RNText,
  View as RNView,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bell,
  Camera,
  Heart,
  Home,
  Lock,
  Mail,
  Search,
  Settings,
  Star,
  User,
} from "lucide-react-native";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  ActionSheet,
  Alert,
  AlertDescription,
  AlertDialog,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvoidKeyboard,
  Badge,
  BottomSheet,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Carousel,
  Checkbox,
  Collapsible,
  Combobox,
  DatePicker,
  Icon,
  Image as UIImageComponent,
  Input,
  InputOTP,
  Link,
  ModeToggle,
  Onboarding,
  Picker,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Progress,
  RadioGroup,
  ScrollView as UIScrollView,
  SearchBar,
  Separator,
  Sheet,
  Skeleton,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  Toggle,
  View as UIView,
  useActionSheet,
  useAlertDialog,
  useBottomSheet,
  useSheet,
  useToast,
} from "@rn-ui/registry";

// expo-image types don't resolve perfectly across the monorepo boundary
const UIImage = UIImageComponent as any;

// ─── Demo helpers ────────────────────────────────────────────────────────────

function DemoSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <RNView style={{ marginBottom: 24 }}>
      {title && (
        <RNText
          style={{
            fontSize: 11,
            fontWeight: "600",
            color: "#9ca3af",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 10,
          }}
        >
          {title}
        </RNText>
      )}
      {children}
    </RNView>
  );
}

// ─── Individual demos ─────────────────────────────────────────────────────────

function AccordionDemo() {
  return (
    <DemoSection title="Single collapsible">
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>What is rn-ui?</AccordionTrigger>
          <AccordionContent>
            <RNText style={{ fontSize: 14, color: "#6b7280" }}>
              A shadcn-style CLI component library for Expo + NativeWind.
            </RNText>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>How does installation work?</AccordionTrigger>
          <AccordionContent>
            <RNText style={{ fontSize: 14, color: "#6b7280" }}>
              Run npx @rn-ui/cli add button and the component is copied into
              your project.
            </RNText>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="c">
          <AccordionTrigger>Does it require shadcn?</AccordionTrigger>
          <AccordionContent>
            <RNText style={{ fontSize: 14, color: "#6b7280" }}>
              No — it's inspired by shadcn/ui but built natively for React
              Native.
            </RNText>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </DemoSection>
  );
}

function AlertDemo() {
  return (
    <>
      {(
        ["default", "info", "warning", "destructive", "success"] as const
      ).map((v) => (
        <DemoSection key={v} title={v}>
          <Alert variant={v}>
            <AlertTitle>
              {v.charAt(0).toUpperCase() + v.slice(1)} Alert
            </AlertTitle>
            <AlertDescription>
              This is a {v} alert message with a description.
            </AlertDescription>
          </Alert>
        </DemoSection>
      ))}
    </>
  );
}

function AlertDialogDemo() {
  const dialog = useAlertDialog();
  return (
    <DemoSection title="Trigger">
      <Button onPress={dialog.open}>Open Alert Dialog</Button>
      <AlertDialog
        isVisible={dialog.isVisible}
        onClose={dialog.close}
        title="Delete item?"
        description="This action cannot be undone. Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          dialog.close();
        }}
        showCancelButton
      />
    </DemoSection>
  );
}

function AvatarDemo() {
  return (
    <DemoSection title="Variants">
      <RNView style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
        <Avatar size={48}>
          <AvatarImage source={{ uri: "https://i.pravatar.cc/150?img=1" }} />
          <AvatarFallback>
            <RNText style={{ fontSize: 16, fontWeight: "600", color: "#6b7280" }}>
              AB
            </RNText>
          </AvatarFallback>
        </Avatar>
        <Avatar size={48}>
          <AvatarImage source={{ uri: "https://invalid.url/no-image" }} />
          <AvatarFallback>
            <RNText style={{ fontSize: 16, fontWeight: "600", color: "#6b7280" }}>
              JD
            </RNText>
          </AvatarFallback>
        </Avatar>
        <Avatar size={64}>
          <AvatarFallback>
            <RNText style={{ fontSize: 20, fontWeight: "600", color: "#6b7280" }}>
              LG
            </RNText>
          </AvatarFallback>
        </Avatar>
      </RNView>
    </DemoSection>
  );
}

function AvoidKeyboardDemo() {
  return (
    <>
      <DemoSection title="Usage">
        <RNText style={{ fontSize: 14, color: "#6b7280", lineHeight: 20 }}>
          Place AvoidKeyboard at the bottom of a screen. It grows to match the
          keyboard height using Reanimated — preventing content from being
          hidden.
        </RNText>
      </DemoSection>
      <DemoSection title="Demo">
        <Input placeholder="Tap to show keyboard" label="Email" />
        <AvoidKeyboard />
      </DemoSection>
    </>
  );
}

function BadgeDemo() {
  return (
    <DemoSection title="Variants">
      <RNView style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {(
          ["default", "secondary", "destructive", "outline", "success"] as const
        ).map((v) => (
          <Badge key={v} variant={v}>
            {v}
          </Badge>
        ))}
      </RNView>
    </DemoSection>
  );
}

function ButtonDemo() {
  return (
    <>
      <DemoSection title="Variants">
        {(
          [
            "default",
            "destructive",
            "success",
            "outline",
            "secondary",
            "ghost",
            "link",
          ] as const
        ).map((v) => (
          <Button key={v} variant={v}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </Button>
        ))}
      </DemoSection>
      <DemoSection title="Sizes">
        <RNView style={{ gap: 8 }}>
          {(["sm", "default", "lg"] as const).map((s) => (
            <Button key={s} size={s}>
              Size {s}
            </Button>
          ))}
        </RNView>
      </DemoSection>
      <DemoSection title="States">
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
        <Button icon={Star}>With Icon</Button>
      </DemoSection>
    </>
  );
}

function CardDemo() {
  return (
    <DemoSection>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>A short description goes here.</CardDescription>
        </CardHeader>
        <CardContent>
          <RNText style={{ fontSize: 14, color: "#6b7280" }}>
            Card content renders any children here. Use it for stats, media, or
            form fields.
          </RNText>
        </CardContent>
        <CardFooter>
          <Button variant="outline" style={{ flex: 1, marginRight: 8 }}>
            Cancel
          </Button>
          <Button style={{ flex: 1 }}>Confirm</Button>
        </CardFooter>
      </Card>
    </DemoSection>
  );
}

function CarouselDemo() {
  const slides = [
    { color: "#3b82f6", label: "Slide 1" },
    { color: "#10b981", label: "Slide 2" },
    { color: "#f59e0b", label: "Slide 3" },
    { color: "#ef4444", label: "Slide 4" },
  ];

  return (
    <DemoSection title="Horizontal pager">
      <Carousel
        data={slides.map((s) => (
          <RNView
            key={s.label}
            style={{
              height: 160,
              backgroundColor: s.color,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 12,
            }}
          >
            <RNText style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>
              {s.label}
            </RNText>
          </RNView>
        ))}
        showDots
        showArrows
      />
    </DemoSection>
  );
}

function CheckboxDemo() {
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(true);
  return (
    <DemoSection title="States">
      <Checkbox
        checked={checked}
        onCheckedChange={setChecked}
        label="Unchecked by default"
      />
      <Checkbox
        checked={checked2}
        onCheckedChange={setChecked2}
        label="Checked by default"
      />
      <Checkbox checked={false} onCheckedChange={() => {}} label="Disabled" disabled />
      <Checkbox
        checked={false}
        onCheckedChange={() => {}}
        label="With error"
        error="This field is required"
      />
    </DemoSection>
  );
}

function CollapsibleDemo() {
  return (
    <DemoSection title="Show / hide">
      <Collapsible title="Installation">
        <RNText style={{ fontSize: 14, color: "#6b7280", lineHeight: 20 }}>
          Run npx @rn-ui/cli add collapsible to copy this component into your
          project.
        </RNText>
      </Collapsible>
      <Collapsible title="Usage">
        <RNText style={{ fontSize: 14, color: "#6b7280", lineHeight: 20 }}>
          Wrap any content in Collapsible and give it a title prop.
        </RNText>
      </Collapsible>
    </DemoSection>
  );
}

function ComboboxDemo() {
  const [value, setValue] = useState("");
  const options = [
    { label: "React Native", value: "rn" },
    { label: "Expo", value: "expo" },
    { label: "NativeWind", value: "nativewind" },
    { label: "Reanimated", value: "reanimated" },
    { label: "TypeScript", value: "ts" },
    { label: "TailwindCSS", value: "tailwind" },
  ];
  return (
    <DemoSection title="Searchable select">
      <Combobox
        options={options}
        value={value}
        onValueChange={setValue}
        label="Framework"
        placeholder="Select framework..."
        clearable
      />
    </DemoSection>
  );
}

function DatePickerDemo() {
  const [date, setDate] = useState<Date | undefined>();
  return (
    <DemoSection title="Calendar modal">
      <DatePicker
        value={date}
        onValueChange={setDate}
        label="Date"
        placeholder="Select a date"
        minDate={new Date(2024, 0, 1)}
      />
    </DemoSection>
  );
}

function IconDemo() {
  const icons = [Home, Star, Heart, Settings, Bell, Mail, Lock, Camera, Search, User];
  return (
    <DemoSection title="lucide-react-native icons">
      <RNView style={{ flexDirection: "row", flexWrap: "wrap", gap: 20 }}>
        {icons.map((LucideIcon, i) => (
          <Icon key={i} icon={LucideIcon} size={24} />
        ))}
      </RNView>
    </DemoSection>
  );
}

function ImageDemo() {
  return (
    <>
      <DemoSection title="Loaded">
        <UIImage
          source={{ uri: "https://picsum.photos/seed/rn-ui/400/200" }}
          containerClassName="rounded-xl"
          containerStyle={{ height: 160 }}
          style={{ flex: 1 }}
          contentFit="cover"
        />
      </DemoSection>
      <DemoSection title="Error state (fallback)">
        <UIImage
          source={{ uri: "https://invalid.url/broken-image" }}
          containerClassName="rounded-xl bg-gray-100"
          containerStyle={{ height: 100 }}
          errorText="Image failed to load"
        />
      </DemoSection>
    </>
  );
}

function InputDemo() {
  const [val, setVal] = useState("");
  return (
    <>
      <DemoSection title="Variants">
        <Input
          value={val}
          onChangeText={setVal}
          label="Filled (default)"
          placeholder="Enter text..."
          hint="This is a hint message"
        />
        <Input
          label="Outline"
          placeholder="Enter text..."
          variant="outline"
        />
        <Input
          label="With icon"
          placeholder="Search..."
          icon={Search}
        />
        <Input label="Error state" placeholder="Email" error="Invalid email" />
        <Input label="Disabled" placeholder="Cannot edit" disabled />
      </DemoSection>
    </>
  );
}

function InputOTPDemo() {
  const [code, setCode] = useState("");
  return (
    <DemoSection title="6-digit OTP">
      <InputOTP
        length={6}
        value={code}
        onChangeText={setCode}
        onComplete={(v: string) => console.log("OTP complete:", v)}
      />
      <RNText style={{ fontSize: 13, color: "#9ca3af", marginTop: 8 }}>
        Value: {code || "—"}
      </RNText>
    </DemoSection>
  );
}

function LinkDemo() {
  return (
    <DemoSection title="External link">
      <Link href="https://expo.dev" browser="in-app">
        Open Expo docs
      </Link>
    </DemoSection>
  );
}

function ModeToggleDemo() {
  return (
    <DemoSection title="Toggle dark/light mode">
      <ModeToggle />
    </DemoSection>
  );
}

function OnboardingDemo() {
  const [visible, setVisible] = useState(false);
  const steps = [
    {
      key: "welcome",
      render: () => (
        <RNView
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
          }}
        >
          <RNText style={{ fontSize: 28, fontWeight: "700", marginBottom: 12 }}>
            Welcome
          </RNText>
          <RNText
            style={{ fontSize: 16, color: "#6b7280", textAlign: "center" }}
          >
            rn-ui gives you beautiful, copy-paste components for Expo.
          </RNText>
        </RNView>
      ),
    },
    {
      key: "install",
      render: () => (
        <RNView
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
          }}
        >
          <RNText style={{ fontSize: 28, fontWeight: "700", marginBottom: 12 }}>
            Install
          </RNText>
          <RNText
            style={{ fontSize: 16, color: "#6b7280", textAlign: "center" }}
          >
            npx @rn-ui/cli add button — and the component lands in your project.
          </RNText>
        </RNView>
      ),
    },
    {
      key: "build",
      render: () => (
        <RNView
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
          }}
        >
          <RNText style={{ fontSize: 28, fontWeight: "700", marginBottom: 12 }}>
            Build
          </RNText>
          <RNText
            style={{ fontSize: 16, color: "#6b7280", textAlign: "center" }}
          >
            Customize freely — you own the code.
          </RNText>
        </RNView>
      ),
    },
  ];

  return (
    <DemoSection title="Full-screen flow">
      <Button onPress={() => setVisible(true)}>Launch Onboarding</Button>
      <Modal visible={visible} animationType="slide">
        <Onboarding steps={steps} onDone={() => setVisible(false)} />
      </Modal>
    </DemoSection>
  );
}

function PickerDemo() {
  const [value, setValue] = useState("");
  const options = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Cherry", value: "cherry" },
    { label: "Durian", value: "durian", disabled: true },
    { label: "Elderberry", value: "elderberry" },
  ];
  return (
    <DemoSection title="Single select">
      <Picker
        options={options}
        value={value}
        onValueChange={setValue}
        label="Fruit"
        placeholder="Select a fruit..."
        searchable
      />
    </DemoSection>
  );
}

function PopoverDemo() {
  return (
    <DemoSection title="Floating panel">
      <Popover>
        <PopoverTrigger>
          <Button variant="outline">Open Popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <RNText
              style={{ fontSize: 15, fontWeight: "600", color: "#111827" }}
            >
              Settings
            </RNText>
          </PopoverHeader>
          <PopoverBody>
            <RNText style={{ fontSize: 14, color: "#6b7280" }}>
              Popover content goes here. It measures the trigger position and
              auto-flips if needed.
            </RNText>
          </PopoverBody>
          <PopoverFooter>
            <Button size="sm">Done</Button>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </DemoSection>
  );
}

function ProgressDemo() {
  const [value, setValue] = useState(60);
  return (
    <DemoSection title="Animated bar">
      <Progress value={value} />
      <RNView style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
        <Button
          variant="outline"
          size="sm"
          style={{ flex: 1 }}
          onPress={() => setValue((v) => Math.max(0, v - 10))}
        >
          -10
        </Button>
        <Button
          size="sm"
          style={{ flex: 1 }}
          onPress={() => setValue((v) => Math.min(100, v + 10))}
        >
          +10
        </Button>
      </RNView>
      <RNText style={{ fontSize: 13, color: "#9ca3af", textAlign: "center" }}>
        {value}%
      </RNText>
    </DemoSection>
  );
}

function RadioDemo() {
  const [value, setValue] = useState("expo");
  return (
    <DemoSection title="Vertical group">
      <RadioGroup
        value={value}
        onValueChange={setValue}
        options={[
          { label: "Expo", value: "expo" },
          { label: "React Native CLI", value: "rn" },
          { label: "Ignite", value: "ignite" },
          { label: "Disabled option", value: "disabled", disabled: true },
        ]}
      />
      <RNText style={{ fontSize: 13, color: "#9ca3af", marginTop: 8 }}>
        Selected: {value}
      </RNText>
    </DemoSection>
  );
}

function ScrollViewDemo() {
  return (
    <DemoSection title="Transparent bg wrapper">
      <UIScrollView
        style={{ maxHeight: 120, backgroundColor: "#f3f4f6", borderRadius: 8 }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <RNText
            key={i}
            style={{ padding: 8, fontSize: 14, color: "#374151" }}
          >
            Row {i + 1}
          </RNText>
        ))}
      </UIScrollView>
    </DemoSection>
  );
}

function SearchBarDemo() {
  const [query, setQuery] = useState("");
  return (
    <DemoSection title="Debounced search">
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search components..."
        debounceMs={300}
      />
      <RNText style={{ fontSize: 13, color: "#9ca3af" }}>
        Query: {query || "—"}
      </RNText>
    </DemoSection>
  );
}

function SeparatorDemo() {
  return (
    <>
      <DemoSection title="Horizontal">
        <Separator />
      </DemoSection>
      <DemoSection title="Vertical (inside a row)">
        <RNView style={{ flexDirection: "row", height: 40, alignItems: "center", gap: 12 }}>
          <RNText style={{ fontSize: 14, color: "#374151" }}>Left</RNText>
          <Separator orientation="vertical" />
          <RNText style={{ fontSize: 14, color: "#374151" }}>Right</RNText>
        </RNView>
      </DemoSection>
    </>
  );
}

function ActionSheetDemo() {
  const sheet = useActionSheet();
  return (
    <DemoSection title="iOS-style action list">
      <Button variant="outline" onPress={sheet.open}>
        Open Action Sheet
      </Button>
      <ActionSheet
        isVisible={sheet.isVisible}
        onClose={sheet.close}
        title="Choose an action"
        actions={[
          { label: "Edit", onPress: sheet.close },
          { label: "Share", onPress: sheet.close },
          { label: "Delete", onPress: sheet.close, variant: "destructive" as const },
        ]}
      />
    </DemoSection>
  );
}

function BottomSheetDemo() {
  const bs = useBottomSheet();
  return (
    <DemoSection title="Draggable with snap points">
      <Button variant="outline" onPress={bs.open}>
        Open Bottom Sheet
      </Button>
      <BottomSheet
        isVisible={bs.isVisible}
        onClose={bs.close}
        title="Bottom Sheet"
        snapPoints={[0.4, 0.75]}
        showCloseButton
      >
        <RNView style={{ padding: 16, gap: 12 }}>
          <RNText style={{ fontSize: 14, color: "#6b7280" }}>
            Drag the handle to snap between 40% and 75% height. Drag down to
            dismiss.
          </RNText>
          <Button onPress={bs.close}>Close</Button>
        </RNView>
      </BottomSheet>
    </DemoSection>
  );
}

function SheetDemo() {
  const bottom = useSheet();
  const right = useSheet();
  return (
    <DemoSection title="Slide from any side">
      <RNView style={{ flexDirection: "row", gap: 8 }}>
        <Button
          variant="outline"
          style={{ flex: 1 }}
          onPress={bottom.open}
        >
          Bottom
        </Button>
        <Button variant="outline" style={{ flex: 1 }} onPress={right.open}>
          Right
        </Button>
      </RNView>
      <Sheet
        isVisible={bottom.isVisible}
        onClose={bottom.close}
        side="bottom"
        title="Bottom Sheet"
        description="Slides in from the bottom."
      >
        <Button onPress={bottom.close}>Close</Button>
      </Sheet>
      <Sheet
        isVisible={right.isVisible}
        onClose={right.close}
        side="right"
        title="Right Sheet"
        description="Slides in from the right."
      >
        <Button onPress={right.close}>Close</Button>
      </Sheet>
    </DemoSection>
  );
}

function SkeletonDemo() {
  return (
    <DemoSection title="Pulsing placeholders">
      <RNView style={{ gap: 10 }}>
        <Skeleton style={{ height: 16, borderRadius: 4 }} />
        <Skeleton style={{ height: 16, width: "75%", borderRadius: 4 }} />
        <Skeleton style={{ height: 16, width: "50%", borderRadius: 4 }} />
        <Skeleton variant="rounded" style={{ height: 80 }} />
      </RNView>
    </DemoSection>
  );
}

function SpinnerDemo() {
  return (
    <DemoSection title="Variants">
      <RNView style={{ flexDirection: "row", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
        {(["default", "circle", "dots", "pulse", "bars"] as const).map((v) => (
          <RNView key={v} style={{ alignItems: "center", gap: 6 }}>
            <Spinner variant={v} />
            <RNText style={{ fontSize: 11, color: "#9ca3af" }}>{v}</RNText>
          </RNView>
        ))}
      </RNView>
    </DemoSection>
  );
}

function SwitchDemo() {
  const [on, setOn] = useState(false);
  const [on2, setOn2] = useState(true);
  return (
    <DemoSection title="Toggle">
      <Switch checked={on} onCheckedChange={setOn} label="Notifications" />
      <Switch checked={on2} onCheckedChange={setOn2} label="Dark mode" />
      <Switch checked={false} onCheckedChange={() => {}} label="Disabled" disabled />
    </DemoSection>
  );
}

function TableDemo() {
  return (
    <DemoSection title="Data table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Component</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Deps</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            { name: "Button", cat: "Form", deps: "expo-haptics" },
            { name: "Avatar", cat: "Display", deps: "expo-image" },
            { name: "Toast", cat: "Overlays", deps: "Reanimated" },
            { name: "Carousel", cat: "Navigation", deps: "—" },
          ].map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.cat}</TableCell>
              <TableCell>{row.deps}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DemoSection>
  );
}

function TabsDemo() {
  return (
    <DemoSection title="Controlled">
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="docs">Docs</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <RNText style={{ fontSize: 14, color: "#6b7280", padding: 12 }}>
            Live component preview renders here.
          </RNText>
        </TabsContent>
        <TabsContent value="code">
          <RNText style={{ fontSize: 14, color: "#6b7280", padding: 12 }}>
            {"<Tabs defaultValue=\"preview\">\n  <TabsTrigger>...</TabsTrigger>\n</Tabs>"}
          </RNText>
        </TabsContent>
        <TabsContent value="docs">
          <RNText style={{ fontSize: 14, color: "#6b7280", padding: 12 }}>
            API reference and prop descriptions.
          </RNText>
        </TabsContent>
      </Tabs>
    </DemoSection>
  );
}

function TextDemo() {
  return (
    <DemoSection title="Variants">
      <Text variant="heading">Heading</Text>
      <Text variant="title">Title</Text>
      <Text variant="subtitle">Subtitle</Text>
      <Text variant="body">Body — the default paragraph text style.</Text>
      <Text variant="caption">Caption — small supporting text</Text>
      <Text variant="link">Link — tappable text style</Text>
    </DemoSection>
  );
}

function ToggleDemo() {
  const [pressed, setPressed] = useState(false);
  return (
    <>
      <DemoSection title="Variants">
        <RNView style={{ flexDirection: "row", gap: 8 }}>
          <Toggle
            pressed={pressed}
            onPressedChange={setPressed}
            variant="default"
          >
            Default
          </Toggle>
          <Toggle
            pressed={pressed}
            onPressedChange={setPressed}
            variant="outline"
          >
            Outline
          </Toggle>
        </RNView>
      </DemoSection>
      <DemoSection title="Sizes">
        <RNView style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          {(["sm", "default", "lg"] as const).map((s) => (
            <Toggle
              key={s}
              pressed={pressed}
              onPressedChange={setPressed}
              size={s}
            >
              {s}
            </Toggle>
          ))}
        </RNView>
      </DemoSection>
    </>
  );
}

function ToastDemo() {
  const toast = useToast();
  return (
    <DemoSection title="Variants">
      <RNView style={{ gap: 8 }}>
        <Button variant="outline" onPress={() => toast.toast({ title: "Default", description: "A neutral notification." })}>
          Show default
        </Button>
        <Button variant="outline" onPress={() => toast.success("Success!", "Operation completed.")}>
          Show success
        </Button>
        <Button variant="outline" onPress={() => toast.error("Error!", "Something went wrong.")}>
          Show error
        </Button>
        <Button variant="outline" onPress={() => toast.warning("Warning!", "Please review this.")}>
          Show warning
        </Button>
        <Button variant="outline" onPress={() => toast.info("Info", "Here is some information.")}>
          Show info
        </Button>
      </RNView>
    </DemoSection>
  );
}

function ViewDemo() {
  return (
    <DemoSection title="Transparent background wrapper">
      <RNText style={{ fontSize: 14, color: "#6b7280", marginBottom: 12 }}>
        UIView prevents the white flash on dark mode by defaulting to
        transparent background instead of white.
      </RNText>
      <UIView className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <RNText style={{ fontSize: 14 }}>Content inside UIView</RNText>
      </UIView>
    </DemoSection>
  );
}

function IconComponentDemo() {
  return <IconDemo />;
}

// ─── Registry ─────────────────────────────────────────────────────────────────

const DEMOS: Record<string, React.ComponentType> = {
  accordion: AccordionDemo,
  alert: AlertDemo,
  "alert-dialog": AlertDialogDemo,
  avatar: AvatarDemo,
  "avoid-keyboard": AvoidKeyboardDemo,
  badge: BadgeDemo,
  button: ButtonDemo,
  card: CardDemo,
  carousel: CarouselDemo,
  checkbox: CheckboxDemo,
  collapsible: CollapsibleDemo,
  combobox: ComboboxDemo,
  "date-picker": DatePickerDemo,
  icon: IconComponentDemo,
  image: ImageDemo,
  input: InputDemo,
  "input-otp": InputOTPDemo,
  link: LinkDemo,
  "mode-toggle": ModeToggleDemo,
  onboarding: OnboardingDemo,
  picker: PickerDemo,
  popover: PopoverDemo,
  progress: ProgressDemo,
  radio: RadioDemo,
  "scroll-view": ScrollViewDemo,
  searchbar: SearchBarDemo,
  separator: SeparatorDemo,
  "action-sheet": ActionSheetDemo,
  "bottom-sheet": BottomSheetDemo,
  sheet: SheetDemo,
  skeleton: SkeletonDemo,
  spinner: SpinnerDemo,
  switch: SwitchDemo,
  table: TableDemo,
  tabs: TabsDemo,
  text: TextDemo,
  toggle: ToggleDemo,
  toast: ToastDemo,
  view: ViewDemo,
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

function displayTitle(name: string): string {
  return (
    TITLE_MAP[name] ??
    name
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join("")
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ComponentScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const Demo = name ? DEMOS[name] : null;
  const title = name ? displayTitle(name) : "";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["bottom"]}>
      <Stack.Screen options={{ title }} />
      {Demo ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
        >
          <Demo />
        </ScrollView>
      ) : (
        <RNView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <RNText style={{ color: "#9ca3af" }}>Demo not found: {name}</RNText>
        </RNView>
      )}
    </SafeAreaView>
  );
}
