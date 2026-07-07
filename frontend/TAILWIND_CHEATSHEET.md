# Tailwind CSS Cheatsheet (quick fixes)

Practical reference for small styling tweaks in this project.
(You can move this file wherever you like later.)

## Mental model

Tailwind classes are just `property-value`, stacked in `className`.
Most follow the pattern: `prefix-name-shade`.

**Color shades:** `50` (lightest) → `950` (darkest).
e.g. `gray-100` is very light, `gray-900` almost black.

## Colors

```
text-white  text-black  text-gray-500  text-red-600  text-blue-600   ← text color
bg-white  bg-gray-50  bg-gray-900  bg-blue-600                        ← background color
border-gray-300  border-red-500                                       ← border color
```

Common palettes: `gray, red, green, blue, yellow, indigo, zinc, slate`.

## Text / typography

```
text-xs  text-sm  text-base  text-lg  text-xl  text-2xl  text-3xl     ← size
font-normal  font-medium  font-semibold  font-bold                   ← weight
text-left  text-center  text-right                                   ← alignment
underline  line-through  italic  uppercase  lowercase  capitalize    ← decoration
leading-tight  leading-normal  leading-relaxed                       ← line height
```

## Spacing (padding & margin)

Scale: `1`=4px, `2`=8px, `3`=12px, `4`=16px, `6`=24px, `8`=32px…

```
p-4    padding all sides           m-4      margin all sides
px-4   padding left+right          mx-auto  center horizontally
py-2   padding top+bottom          mt-6     margin top
pl-3   padding left                mb-4     margin bottom
gap-3  space between flex/grid children
space-y-4  vertical space between stacked children
```

## Sizing

```
w-full  w-1/2  w-64  w-4          ← width (full, half, fixed)
h-full  h-screen  h-10  h-4       ← height
max-w-sm  max-w-md  max-w-2xl     ← max width (sm≈24rem, md≈28rem…)
min-h-full
```

## Borders & corners

```
border  border-2                 ← border width
border-gray-300                  ← border color
rounded  rounded-md  rounded-lg  rounded-full   ← corner radius
```

## Layout (flexbox — the workhorse)

```
flex                    turn on flexbox
flex-col                stack vertically (default is row)
items-center           align items vertically (cross-axis)
justify-between        space items apart (main-axis)
justify-center         center items
gap-4                  space between items
flex-1                 grow to fill space
```

## States (add a prefix; the `:` becomes `-`)

```
hover:bg-gray-700       on mouse hover
focus:border-gray-900   when focused (inputs)
focus:outline-none      remove default focus ring
disabled:opacity-50     when the element is disabled
```

Example: `bg-gray-900 hover:bg-gray-700 disabled:opacity-50`

## Dark mode (theme-aware colors)

```
text-gray-900 dark:text-white     ← dark gray normally, white in dark mode
bg-white dark:bg-gray-900
```

## Arbitrary values (when the scale isn't enough)

Use square brackets:

```
text-[#1a2b3c]   bg-[#f5f5f5]   w-[350px]   text-[13px]
```

## Fixing dim / low-contrast text

The faint text is usually a gray on a mismatched background. Pick contrast:

- On a **light** background → `text-gray-900` (headings), `text-gray-700` (labels)
- On a **dark** background → `text-white` or `text-gray-100`
- Theme-proof → `text-gray-900 dark:text-white`

Note: elements with no color class inherit the default text color, so add an
explicit `text-...` to control them.
