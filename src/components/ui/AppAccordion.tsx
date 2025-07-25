import { Accordion, AccordionProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export interface AppAccordionProps extends AccordionProps {
  color?: "primary" | "secondary" | "highlight" | "natural" | "dark";
  selected?: boolean;
  success?: boolean;
}

const StyledAccordion = styled(Accordion)<AppAccordionProps>(
  ({ theme, selected, success }) => ({
    border: `1px solid ${theme.palette.natural.dark}`,
    borderRadius: "12px !important",
    boxShadow: "none",
    ...(selected && {
      backgroundColor: "#EAF2FF",
      borderColor: "#90baff",
    }),
    ...(success && {
      backgroundColor: "#ebffe7",
    }),
    "&::before": {
      display: "none",
    },
    paddingTop: "3px",
    paddingBottom: "3px",
  })
);

export default function AppAccordion(props: AppAccordionProps) {
  return <StyledAccordion {...props} selected={props.selected} />;
}
