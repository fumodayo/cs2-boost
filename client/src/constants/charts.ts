import { AxisModel, ValueType } from "@syncfusion/ej2-react-charts";

const stackedPrimaryXAxis: AxisModel = {
  majorGridLines: { width: 0 },
  interval: 1,
  labelIntersectAction: "Rotate45",
  valueType: "Category" as ValueType,
};

const stackedPrimaryYAxisQuantity: AxisModel = {
  labelFormat: "{value}",
};

export { stackedPrimaryXAxis, stackedPrimaryYAxisQuantity };
