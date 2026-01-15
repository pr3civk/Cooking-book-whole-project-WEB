import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/tailwind";

export const TYPOGRAPHY_VARIANTS = cva("", {
	variants: {
		variant: {
			h1: "text-[clamp(2rem,10vw,2.5rem)] font-[500] tracking-normal", // 48px (fontSize)
			h2: "text-[clamp(1.5rem,10vw,2rem)] font-[500] normal-case", // 32px (fontSize)
			h3: "text-[clamp(1.25rem,10vw,1.75rem)] font-[500] normal-case", // 28px (fontSize)
			h4: "text-[clamp(1.125rem,10vw,1.5rem)] font-[500] normal-case", // 24px (fontSize)
			h5: "text-[clamp(1rem,10vw,1.25rem)] font-[500] normal-case", // 20px (fontSize)
			h6: "text-[clamp(0.875rem,10vw,1.125rem)] font-[500] normal-case", // 18px (fontSize)
			titleXl: "text-[clamp(1.125rem,4vw,1.25rem)] font-[500] normal-case", // 20px (fontSize)
			titleLg: "text-[clamp(1rem,4vw,1.125rem)] font-[500] normal-case", // 18px (fontSize)
			titleBase: "text-[clamp(0.875rem,4vw,1rem)] font-[500] normal-case", // 16px (fontSize)
			titleSm: "text-[clamp(0.75rem,4vw,0.875rem)] font-[500] normal-case", // 14px (fontSize)
			caption1:
				"text-[clamp(0.625rem,2vw,0.6875rem)] font-[400] tracking-[0.02em] uppercase", // 11px (fontSize)
			caption1_5:
				"text-[clamp(0.6875rem,2vw,0.75rem)] font-[400] tracking-[0.01em] uppercase", // 12px (fontSize)
			caption2:
				"text-[clamp(0.75rem,2vw,0.8125rem)] font-[400] tracking-[0.02em] uppercase", // 13px (fontSize)
			caption3:
				"text-[clamp(0.5625rem,2vw,0.625rem)] font-[400] tracking-[0.05em] uppercase", // 10px (fontSize)
			caption4:
				"text-[clamp(0.4375rem,2vw,0.5rem)] font-[400] tracking-[0.02em] uppercase", // 8px (fontSize)
			standard: "text-[clamp(0.875rem,4vw,1rem)] font-[400] capitalize", // 16px (fontSize)
			standardSm: "text-[clamp(0.8125rem,3vw,0.875rem)] font-[400] capitalize", // 14px (fontSize)
			standardXs:
				"text-[clamp(0.6875rem,3vw,0.75rem)] font-[400] tracking-[0.01em] capitalize", // 12px (fontSize)
			standardLg:
				"text-[clamp(1.375rem,6vw,1.625rem)] font-[400] tracking-[0.01em] capitalize", // 26px (fontSize)
			unstyled: "",
		},
	},
	defaultVariants: {
		variant: "standard",
	},
});

export type TypographyVariant = VariantProps<
	typeof TYPOGRAPHY_VARIANTS
>["variant"];

export type TypographyProps = React.ComponentProps<"div"> &
	VariantProps<typeof TYPOGRAPHY_VARIANTS> & {
		as?: React.ElementType;
	};

export function Typography({
	as = "div",
	variant = "h1",
	className,
	...props
}: TypographyProps) {
	const Comp = as as React.ElementType;
	return (
		<Comp
			className={cn(TYPOGRAPHY_VARIANTS({ variant, className }))}
			{...props}
		/>
	);
}
