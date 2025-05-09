# دليل تحويل مكونات Radix UI إلى Material UI (MUI)

هذا الدليل يساعدك على تحويل مكونات Radix UI إلى مكونات Material UI (MUI) في مشروعك.

## المكونات التي تم تحويلها

- ✅ Alert Dialog
- ✅ Accordion
- ✅ Avatar
- ✅ Checkbox

## المكونات المتبقية للتحويل

يجب تحويل المكونات التالية:

- Aspect Ratio
- Breadcrumb
- Button
- Card
- Collapsible
- Command
- Context Menu
- Dialog
- Dropdown Menu
- Form
- Hover Card
- Label
- Menubar
- Navigation Menu
- Popover
- Progress
- Radio Group
- Scroll Area
- Select
- Separator
- Sheet
- Slider
- Switch
- Tabs
- Toggle
- Toggle Group
- Tooltip

## خطوات التحويل العامة

1. **تحديد المكون في MUI**: ابحث عن المكون المقابل في MUI [من وثائق MUI](https://mui.com/material-ui/getting-started/overview/).

2. **استبدال الاستيرادات**: استبدل استيرادات Radix UI بمكونات MUI المقابلة.

3. **تعديل الواجهة البرمجية**: قم بتعديل الواجهة البرمجية لتتوافق مع مكونات MUI.

4. **تخصيص المظهر**: استخدم `styled` من MUI لتخصيص مظهر المكونات.

## مثال على التحويل

### من Radix UI
```tsx
import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn('...', className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
```

### إلى MUI
```tsx
import * as React from 'react';
import MuiCheckbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';

const StyledCheckbox = styled(MuiCheckbox)(({ theme }) => ({
  // تخصيصات
}));

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof MuiCheckbox> & { className?: string }
>(({ className, ...props }, ref) => (
  <StyledCheckbox
    ref={ref}
    className={cn('...', className)}
    {...props}
  />
));
```

## حذف اعتماديات Radix UI

بعد تحويل جميع المكونات، قم بحذف اعتماديات Radix UI من package.json:

```bash
npm uninstall @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip 