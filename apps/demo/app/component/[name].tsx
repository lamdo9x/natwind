import React, { useState, useCallback, useRef } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text as RNText,
  View as RNView,
  Image as RNImage,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
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
  AudioPlayer,
  AudioRecorder,
  AudioWaveform,
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvoidKeyboard,
  Badge,
  BottomSheet,
  Button,
  CameraComponent,
  CameraPreview,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Carousel,
  Checkbox,
  Collapsible,
  ColorPicker,
  Combobox,
  DatePicker,
  FilePicker,
  Gallery,
  HelloWave,
  Icon,
  Image as UIImageComponent,
  Input,
  InputOTP,
  Link,
  MediaPicker,
  ModeToggle,
  Onboarding,
  ParallaxScrollView,
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
  ShareButton,
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
  VideoPlayer,
  View as UIView,
  useActionSheet,
  useAlertDialog,
  useBottomSheet,
  useSheet,
  useTheme,
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
  const tokens = useTheme();
  return (
    <RNView style={{ marginBottom: 24 }}>
      {title && (
        <RNText
          style={{
            fontSize: 11,
            fontWeight: "600",
            color: tokens.mutedForeground,
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
            <RNText className="text-sm text-muted-foreground">
              A shadcn-style CLI component library for Expo + NativeWind.
            </RNText>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>How does installation work?</AccordionTrigger>
          <AccordionContent>
            <RNText className="text-sm text-muted-foreground">
              Run npx @rn-ui/cli add button and the component is copied into
              your project.
            </RNText>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="c">
          <AccordionTrigger>Does it require shadcn?</AccordionTrigger>
          <AccordionContent>
            <RNText className="text-sm text-muted-foreground">
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
            <RNText className="text-base font-semibold text-muted-foreground">
              AB
            </RNText>
          </AvatarFallback>
        </Avatar>
        <Avatar size={48}>
          <AvatarImage source={{ uri: "https://invalid.url/no-image" }} />
          <AvatarFallback>
            <RNText className="text-base font-semibold text-muted-foreground">
              JD
            </RNText>
          </AvatarFallback>
        </Avatar>
        <Avatar size={64}>
          <AvatarFallback>
            <RNText className="text-xl font-semibold text-muted-foreground">
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
        <RNText className="text-sm text-muted-foreground leading-5">
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
          <RNText className="text-sm text-muted-foreground">
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
        <RNText className="text-sm text-muted-foreground leading-5">
          Run npx @rn-ui/cli add collapsible to copy this component into your
          project.
        </RNText>
      </Collapsible>
      <Collapsible title="Usage">
        <RNText className="text-sm text-muted-foreground leading-5">
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
          containerClassName="rounded-xl bg-muted"
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
      <RNText className="text-xs text-muted-foreground mt-2">
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
            className="text-base text-muted-foreground text-center"
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
            className="text-base text-muted-foreground text-center"
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
            className="text-base text-muted-foreground text-center"
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
            <Text className="text-base font-semibold text-foreground">
              Settings
            </Text>
          </PopoverHeader>
          <PopoverBody>
            <RNText className="text-sm text-muted-foreground">
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
      <RNText className="text-xs text-muted-foreground text-center">
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
      <RNText className="text-xs text-muted-foreground mt-2">
        Selected: {value}
      </RNText>
    </DemoSection>
  );
}

function ScrollViewDemo() {
  const tokens = useTheme();
  return (
    <DemoSection title="Transparent bg wrapper">
      <UIScrollView
        style={{ maxHeight: 120, backgroundColor: tokens.muted, borderRadius: 8 }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <RNText
            key={i}
            style={{ padding: 8, fontSize: 14, color: tokens.foreground }}
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
      <RNText className="text-xs text-muted-foreground">
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
          <Text className="text-sm text-foreground">Left</Text>
          <Separator orientation="vertical" />
          <Text className="text-sm text-foreground">Right</Text>
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
          <RNText className="text-sm text-muted-foreground">
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
            <RNText className="text-muted-foreground" style={{ fontSize: 11 }}>{v}</RNText>
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
          <RNText className="text-sm text-muted-foreground p-3">
            Live component preview renders here.
          </RNText>
        </TabsContent>
        <TabsContent value="code">
          <RNText className="text-sm text-muted-foreground p-3">
            {"<Tabs defaultValue=\"preview\">\n  <TabsTrigger>...</TabsTrigger>\n</Tabs>"}
          </RNText>
        </TabsContent>
        <TabsContent value="docs">
          <RNText className="text-sm text-muted-foreground p-3">
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
      <RNText className="text-sm text-muted-foreground mb-3">
        UIView prevents the white flash on dark mode by defaulting to
        transparent background instead of white.
      </RNText>
      <UIView className="p-4 rounded-xl border border-border">
        <RNText style={{ fontSize: 14 }}>Content inside UIView</RNText>
      </UIView>
    </DemoSection>
  );
}

function IconComponentDemo() {
  return <IconDemo />;
}

function AudioWaveformDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const bars = Array.from({ length: 40 }, () => Math.random());
  return (
    <>
      <DemoSection title="Static waveform">
        <AudioWaveform data={bars} height={60} barCount={40} animated={false} />
      </DemoSection>
      <DemoSection title="Animated (live)">
        <AudioWaveform data={bars} isPlaying={isPlaying} height={60} animated />
        <Button
          variant="outline"
          size="sm"
          onPress={() => setIsPlaying((v) => !v)}
          style={{ marginTop: 12 }}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
      </DemoSection>
    </>
  );
}

function AudioPlayerDemo() {
  return (
    <DemoSection title="Remote audio">
      <AudioPlayer
        source={{ uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }}
        showWaveform
      />
    </DemoSection>
  );
}

function AudioRecorderDemo() {
  return (
    <DemoSection title="Record & playback">
      <AudioRecorder
        onRecordingComplete={(uri) => console.log("Recording:", uri)}
        maxDurationMs={30000}
        showTimer
        showWaveform
      />
    </DemoSection>
  );
}

function FilePickerDemo() {
  const [files, setFiles] = useState<any[]>([]);
  return (
    <DemoSection title="Document picker">
      <FilePicker
        multiple
        maxFiles={5}
        selectedFiles={files}
        onSelectionChange={setFiles}
        onError={(e) => console.warn(e)}
        buttonText="Select Files"
        showPreview
      />
    </DemoSection>
  );
}

function MediaPickerDemo() {
  const [assets, setAssets] = useState<any[]>([]);
  return (
    <>
      <DemoSection title="Image picker (system)">
        <MediaPicker
          mediaType="image"
          multiple
          maxSelection={4}
          selectedAssets={assets}
          onSelectionChange={setAssets}
          onError={(e) => console.warn(e)}
          showPreview
          previewSize={72}
        />
      </DemoSection>
      <DemoSection title="Custom gallery UI">
        <MediaPicker
          gallery
          mediaType="image"
          multiple
          maxSelection={6}
          onSelectionChange={(a) => console.log("gallery pick:", a.length)}
          onError={(e) => console.warn(e)}
          showPreview={false}
          buttonText="Browse Gallery"
        />
      </DemoSection>
    </>
  );
}

function GalleryDemo() {
  const items = [
    { id: "1", uri: "https://picsum.photos/seed/a/400/400", title: "Mountain" },
    { id: "2", uri: "https://picsum.photos/seed/b/400/400", title: "Forest" },
    { id: "3", uri: "https://picsum.photos/seed/c/400/400", title: "Ocean" },
    { id: "4", uri: "https://picsum.photos/seed/d/400/400", title: "Desert" },
    { id: "5", uri: "https://picsum.photos/seed/e/400/400", title: "City" },
    { id: "6", uri: "https://picsum.photos/seed/f/400/400", title: "Sunset" },
  ];
  return (
    <DemoSection title="Grid (tap to fullscreen)">
      <Gallery
        items={items}
        columns={3}
        spacing={2}
        enableFullscreen
        enableZoom
        showPages
        showTitles
        scrollEnabled={false}
      />
    </DemoSection>
  );
}

function HelloWaveDemo() {
  return (
    <DemoSection title="Sizes">
      <RNView style={{ flexDirection: "row", gap: 24, alignItems: "center" }}>
        <HelloWave size="sm" />
        <HelloWave size="md" />
        <HelloWave size="lg" />
      </RNView>
      <RNText className="text-xs text-muted-foreground mt-2">
        sm / md / lg — repeats the wave animation 4 times
      </RNText>
    </DemoSection>
  );
}

function ParallaxScrollViewDemo() {
  return (
    <DemoSection title="Parallax header (scroll inside)">
      <RNView style={{ height: 300, borderRadius: 12, overflow: "hidden" }}>
        <ParallaxScrollView
          headerHeight={140}
          headerImage={
            <RNImage
              source={{ uri: "https://picsum.photos/seed/parallax/800/400" }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          }
        >
          {Array.from({ length: 8 }, (_, i) => (
            <Text
              key={i}
              className="text-sm text-foreground px-4 py-4 border-b border-border"
            >
              Row {i + 1} — scroll up to see parallax effect
            </Text>
          ))}
        </ParallaxScrollView>
      </RNView>
    </DemoSection>
  );
}

function ShareButtonDemo() {
  return (
    <DemoSection title="Native share sheet">
      <ShareButton
        content={{ title: "rn-ui", message: "Check out this awesome React Native component library!" }}
        showIcon
      >
        Share rn-ui
      </ShareButton>
      <ShareButton
        variant="outline"
        content={{ url: "https://expo.dev", title: "Expo" }}
        showIcon
        style={{ marginTop: 8 }}
      >
        Share URL
      </ShareButton>
    </DemoSection>
  );
}

function CameraComponentDemo() {
  const [visible, setVisible] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  return (
    <>
      <DemoSection title="Live camera">
        <Button onPress={() => setVisible(true)} icon={Camera}>
          Open Camera
        </Button>
        {photo && (
          <RNImage
            source={{ uri: photo }}
            style={{ width: "100%", height: 200, borderRadius: 12, marginTop: 12 }}
            resizeMode="cover"
          />
        )}
      </DemoSection>
      <Modal visible={visible} animationType="slide">
        <CameraComponent
          onCapture={(p) => { setPhoto(p.uri); setVisible(false); }}
          onClose={() => setVisible(false)}
          showControls
          enableFlash
          enableFlip
        />
      </Modal>
    </>
  );
}

function CameraPreviewDemo() {
  const [confirmed, setConfirmed] = useState(false);
  const sampleUri = "https://picsum.photos/seed/camera/400/600";
  return (
    <DemoSection title="Photo review actions">
      {confirmed ? (
        <RNView style={{ alignItems: "center", gap: 12 }}>
          <Text className="text-sm font-semibold text-success">
            Photo confirmed!
          </Text>
          <Button variant="outline" size="sm" onPress={() => setConfirmed(false)}>
            Reset
          </Button>
        </RNView>
      ) : (
        <RNView style={{ height: 400, borderRadius: 12, overflow: "hidden" }}>
          <CameraPreview
            uri={sampleUri}
            showActions
            enableShare
            enableDelete
            onRetake={() => console.log("retake")}
            onConfirm={() => setConfirmed(true)}
            onDelete={() => console.log("delete")}
          />
        </RNView>
      )}
    </DemoSection>
  );
}

function ColorPickerDemo() {
  const [color, setColor] = useState("#3b82f6");
  return (
    <DemoSection title="HSV picker">
      <ColorPicker value={color} onChange={setColor} showHex showPreview />
      <RNView
        style={{
          marginTop: 16,
          height: 48,
          borderRadius: 8,
          backgroundColor: color,
        }}
      />
      <RNText className="text-xs text-muted-foreground text-center mt-1">
        Selected: {color}
      </RNText>
    </DemoSection>
  );
}

function VideoPlayerDemo() {
  return (
    <DemoSection title="Custom controls">
      <VideoPlayer
        uri="https://www.w3schools.com/html/mov_bbb.mp4"
        showControls
        showProgress
        showTimer
        height={220}
        loop
      />
    </DemoSection>
  );
}

// ─── Registry ─────────────────────────────────────────────────────────────────

const DEMOS: Record<string, React.ComponentType> = {
  accordion: AccordionDemo,
  alert: AlertDemo,
  "alert-dialog": AlertDialogDemo,
  "audio-waveform": AudioWaveformDemo,
  "audio-player": AudioPlayerDemo,
  "audio-recorder": AudioRecorderDemo,
  avatar: AvatarDemo,
  "avoid-keyboard": AvoidKeyboardDemo,
  badge: BadgeDemo,
  button: ButtonDemo,
  camera: CameraComponentDemo,
  "camera-preview": CameraPreviewDemo,
  card: CardDemo,
  carousel: CarouselDemo,
  checkbox: CheckboxDemo,
  collapsible: CollapsibleDemo,
  "color-picker": ColorPickerDemo,
  combobox: ComboboxDemo,
  "date-picker": DatePickerDemo,
  "file-picker": FilePickerDemo,
  gallery: GalleryDemo,
  "hello-wave": HelloWaveDemo,
  icon: IconComponentDemo,
  image: ImageDemo,
  input: InputDemo,
  "input-otp": InputOTPDemo,
  link: LinkDemo,
  "media-picker": MediaPickerDemo,
  "mode-toggle": ModeToggleDemo,
  onboarding: OnboardingDemo,
  "parallax-scroll-view": ParallaxScrollViewDemo,
  picker: PickerDemo,
  popover: PopoverDemo,
  progress: ProgressDemo,
  radio: RadioDemo,
  "scroll-view": ScrollViewDemo,
  searchbar: SearchBarDemo,
  separator: SeparatorDemo,
  share: ShareButtonDemo,
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
  video: VideoPlayerDemo,
  view: ViewDemo,
};

const TITLE_MAP: Record<string, string> = {
  "input-otp": "InputOTP",
  "alert-dialog": "AlertDialog",
  "audio-waveform": "AudioWaveform",
  "audio-player": "AudioPlayer",
  "audio-recorder": "AudioRecorder",
  "avoid-keyboard": "AvoidKeyboard",
  camera: "Camera",
  "camera-preview": "CameraPreview",
  "color-picker": "ColorPicker",
  "date-picker": "DatePicker",
  "file-picker": "FilePicker",
  gallery: "Gallery",
  "hello-wave": "HelloWave",
  "media-picker": "MediaPicker",
  "mode-toggle": "ModeToggle",
  "parallax-scroll-view": "ParallaxScrollView",
  "scroll-view": "ScrollView",
  share: "ShareButton",
  "action-sheet": "ActionSheet",
  "bottom-sheet": "BottomSheet",
  video: "VideoPlayer",
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

  const tokens = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.background }} edges={["bottom"]}>
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
          <RNText style={{ color: tokens.mutedForeground }}>Demo not found: {name}</RNText>
        </RNView>
      )}
    </SafeAreaView>
  );
}
