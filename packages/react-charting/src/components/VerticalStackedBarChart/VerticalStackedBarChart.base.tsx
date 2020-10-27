import * as React from 'react';
import { max as d3Max } from 'd3-array';
import { Axis as D3Axis } from 'd3-axis';
import { scaleLinear as d3ScaleLinear, ScaleLinear as D3ScaleLinear } from 'd3-scale';
import { classNamesFunction, getId, getRTL, find, warnDeprecations } from '@fluentui/react/lib/Utilities';
import { IPalette } from '@fluentui/react/lib/Styling';
import { DirectionalHint } from '@fluentui/react/lib/Callout';
import { ILegend, Legends } from '../Legends/index';
import {
  CartesianChart,
  ChartHoverCard,
  IBasestate,
  IChildProps,
  IDataPoint,
  IMargins,
  IVerticalStackedBarChartProps,
  IVerticalStackedBarChartStyleProps,
  IVerticalStackedBarChartStyles,
  IVerticalStackedChartProps,
  IVSChartDataPoint,
} from '../../index';
import { FocusZoneDirection } from '@fluentui/react-focus';
import { ChartTypes, XAxisTypes } from '../../utilities/index';

const getClassNames = classNamesFunction<IVerticalStackedBarChartStyleProps, IVerticalStackedBarChartStyles>();
type NumericAxis = D3Axis<number | { valueOf(): number }>;
type NumericScale = D3ScaleLinear<number, number>;
type StringScale = D3ScaleLinear<string, string>;
const COMPONENT_NAME = 'VERTICAL STACKED BAR CHART';

// When displaying gaps between bars, the max height of the gap is given in the
// props. The actual gap is calculated with this multiplier, with a minimum gap
// of 1 pixel. (If these values are changed, update the comment for barGapMax.)
const barGapMultiplier = 0.2;
const barGapMin = 1;

interface IRefArrayData {
  refElement?: SVGGElement | null;
}

export interface IVerticalStackedBarChartState extends IBasestate {
  selectedLegendTitle: string;
  dataPointCalloutProps?: IVSChartDataPoint;
  stackCalloutProps?: IVerticalStackedChartProps;
}
export class VerticalStackedBarChartBase extends React.Component<
  IVerticalStackedBarChartProps,
  IVerticalStackedBarChartState
> {
  private _points: IVerticalStackedChartProps[];
  private _dataset: IDataPoint[];
  private _xAxisLabels: string[];
  private _bars: JSX.Element[];
  private _isNumeric: boolean;
  private _barWidth: number;
  private _calloutId: string;
  private _colors: string[];
  private margins: IMargins;
  private _isRtl: boolean = getRTL();

  public constructor(props: IVerticalStackedBarChartProps) {
    super(props);
    this.state = {
      isCalloutVisible: false,
      isLegendSelected: false,
      isLegendHovered: false,
      selectedLegendTitle: '',
      refSelected: null,
      dataForHoverCard: 0,
      color: '',
      hoverXValue: '',
      YValueHover: [],
      xCalloutValue: '',
      yCalloutValue: '',
    };
    warnDeprecations(COMPONENT_NAME, props, {
      colors: 'IVSChartDataPoint.color',
      chartLabel: 'use your own title for chart',
    });
    this._onLegendLeave = this._onLegendLeave.bind(this);
    this._handleMouseOut = this._handleMouseOut.bind(this);
    this._calloutId = getId('callout');
    this._adjustProps();
    this._dataset = this._createDataSetLayer();
  }

  public componentDidUpdate(prevProps: IVerticalStackedBarChartProps): void {
    if (
      prevProps.height !== this.props.height ||
      prevProps.width !== this.props.width ||
      prevProps.data !== this.props.data
    ) {
      this._adjustProps();
      this._dataset = this._createDataSetLayer();
    }
  }

  public render(): React.ReactNode {
    this._adjustProps();
    this._dataset = this._createDataSetLayer();
    this._isNumeric = this._dataset.length > 0 && typeof this._dataset[0].x === 'number';
    const legendBars: JSX.Element = this._getLegendData(this._points, this.props.theme!.palette);

    const calloutProps = {
      isCalloutVisible: this.state.isCalloutVisible,
      directionalHint: DirectionalHint.topRightEdge,
      id: `toolTip${this._calloutId}`,
      target: this.state.refSelected,
      isBeakVisible: false,
      gapSpace: 15,
      color: this.state.color,
      Legend: this.state.selectedLegendTitle,
      XValue: this.state.xCalloutValue!,
      YValue: this.state.yCalloutValue ? this.state.yCalloutValue : this.state.dataForHoverCard,
      YValueHover: this.state.YValueHover,
      hoverXValue: this.state.hoverXValue,
      ...this.props.calloutProps,
    };
    const tickParams = {
      tickValues: this.props.tickValues,
      tickFormat: this.props.tickFormat,
    };

    return (
      <CartesianChart
        {...this.props}
        points={this._dataset}
        chartType={ChartTypes.VerticalStackedBarChart}
        xAxisType={this._isNumeric ? XAxisTypes.NumericAxis : XAxisTypes.StringAxis}
        calloutProps={calloutProps}
        tickParams={tickParams}
        legendBars={legendBars}
        datasetForXAxisDomain={this._xAxisLabels}
        isCalloutForStack={this.props.isCalloutForStack!}
        barwidth={this._barWidth}
        focusZoneDirection={this.props.isCalloutForStack ? FocusZoneDirection.horizontal : FocusZoneDirection.vertical}
        getmargins={this._getMargins}
        getGraphData={this._getGraphData}
        customizedCallout={this._getCustomizedCallout()}
        /* eslint-disable react/jsx-no-bind */
        // eslint-disable-next-line react/no-children-prop
        children={(props: IChildProps) => {
          return <g>{this._bars}</g>;
        }}
      />
    );
  }

  private _adjustProps(): void {
    this._points = this.props.data || [];
    this._barWidth = this.props.barWidth || 32;
    const { theme } = this.props;
    const { palette } = theme!;
    // eslint-disable-next-line deprecation/deprecation
    this._colors = this.props.colors || [palette.blueLight, palette.blue, palette.blueMid, palette.red, palette.black];
  }

  private _createDataSetLayer(): IDataPoint[] {
    const tempArr: string[] = [];
    const dataset: IDataPoint[] = this._points.map(singlePointData => {
      let total: number = 0;
      singlePointData.chartData!.forEach((point: IVSChartDataPoint) => {
        total = total + point.data;
      });
      !this._isNumeric && tempArr.push(singlePointData.xAxisPoint as string);
      return {
        x: singlePointData.xAxisPoint,
        y: total,
      };
    });
    this._xAxisLabels = tempArr;
    return dataset;
  }

  private _getMargins = (margins: IMargins) => {
    this.margins = margins;
  };

  private _renderCallout(props?: IVSChartDataPoint): JSX.Element | null {
    return props ? (
      <ChartHoverCard
        XValue={props.xAxisCalloutData}
        Legend={props.legend}
        YValue={props.yAxisCalloutData}
        color={props.color}
      />
    ) : null;
  }

  private _getCustomizedCallout = () => {
    return this.props.onRenderCalloutPerStack
      ? this.props.onRenderCalloutPerStack(this.state.stackCalloutProps)
      : this.props.onRenderCalloutPerDataPoint
      ? this.props.onRenderCalloutPerDataPoint(this.state.dataPointCalloutProps, this._renderCallout)
      : null;
  };

  private _onLegendClick(customMessage: string): void {
    if (this.state.isLegendSelected) {
      if (this.state.selectedLegendTitle === customMessage) {
        this.setState({
          isLegendSelected: false,
          selectedLegendTitle: customMessage,
        });
      } else {
        this.setState({
          selectedLegendTitle: customMessage,
        });
      }
    } else {
      this.setState({
        isLegendSelected: true,
        selectedLegendTitle: customMessage,
      });
    }
  }

  private _onLegendHover(customMessage: string): void {
    if (this.state.isLegendSelected === false) {
      this.setState({
        isLegendHovered: true,
        selectedLegendTitle: customMessage,
      });
    }
  }

  private _onLegendLeave(isLegendFocused?: boolean): void {
    if (!!isLegendFocused || this.state.isLegendSelected === false) {
      this.setState({
        isLegendHovered: false,
        selectedLegendTitle: '',
        isLegendSelected: isLegendFocused ? false : this.state.isLegendSelected,
      });
    }
  }

  private _getLegendData(data: IVerticalStackedChartProps[], palette: IPalette): JSX.Element {
    const defaultPalette: string[] = [palette.blueLight, palette.blue, palette.blueMid, palette.red, palette.black];
    const actions: ILegend[] = [];

    data.forEach((singleChartData: IVerticalStackedChartProps) => {
      singleChartData.chartData.forEach((point: IVSChartDataPoint) => {
        const color: string = point.color ? point.color : defaultPalette[Math.floor(Math.random() * 4 + 1)];
        const checkSimilarLegends = actions.filter((leg: ILegend) => leg.title === point.legend && leg.color === color);
        if (checkSimilarLegends!.length > 0) {
          return;
        }

        const legend: ILegend = {
          title: point.legend,
          color: color,
          action: () => {
            this._onLegendClick(point.legend);
          },
          hoverAction: () => {
            this._onLegendHover(point.legend);
          },
          onMouseOutAction: (isLegendSelected?: boolean) => {
            this._onLegendLeave(isLegendSelected);
          },
        };

        actions.push(legend);
      });
    });
    return (
      <Legends
        legends={actions}
        overflowProps={this.props.legendsOverflowProps}
        enabledWrapLines={this.props.enabledLegendsWrapLines}
        focusZonePropsInHoverCard={this.props.focusZonePropsForLegendsInHoverCard}
        overflowText={this.props.legendsOverflowText}
        {...this.props.legendProps}
      />
    );
  }

  private _onRectHover(
    xAxisPoint: string,
    point: IVSChartDataPoint,
    mouseEvent: React.MouseEvent<SVGPathElement>,
  ): void {
    mouseEvent.persist();
    if (
      this.state.isLegendSelected === false ||
      (this.state.isLegendSelected && this.state.selectedLegendTitle === point!.legend)
    ) {
      this.setState({
        refSelected: mouseEvent,
        isCalloutVisible: true,
        selectedLegendTitle: point.legend,
        dataForHoverCard: point.data,
        color: point.color!,
        xCalloutValue: point.xAxisCalloutData ? point.xAxisCalloutData : xAxisPoint,
        yCalloutValue: point.yAxisCalloutData,
        dataPointCalloutProps: point,
      });
    }
  }

  private _onStackHover = (xAxisPoint: string, mouseEvent: React.MouseEvent<SVGPathElement>): void => {
    mouseEvent.persist();
    const found = find(
      this._points,
      (sinlgePoint: { xAxisPoint: string | number; chartData: IVSChartDataPoint[] }) =>
        sinlgePoint.xAxisPoint === xAxisPoint,
    );
    this.setState({
      refSelected: mouseEvent,
      isCalloutVisible: true,
      YValueHover: found!.chartData,
      hoverXValue: xAxisPoint,
      stackCalloutProps: found!,
    });
  };

  private _onRectFocus(point: IVSChartDataPoint, xAxisPoint: string, color: string, ref: IRefArrayData): void {
    if (
      this.state.isLegendSelected === false ||
      (this.state.isLegendSelected && this.state.selectedLegendTitle === point.legend)
    ) {
      this.setState({
        refSelected: ref.refElement,
        isCalloutVisible: true,
        selectedLegendTitle: point.legend,
        dataForHoverCard: point.data,
        color: color,
        xCalloutValue: point.xAxisCalloutData ? point.xAxisCalloutData : xAxisPoint,
        yCalloutValue: point.yAxisCalloutData,
        dataPointCalloutProps: point,
      });
    }
  }

  private _onStackFocus = (xAxisPoint: string | number, groupRef: IRefArrayData): void => {
    const found = find(
      this._points,
      (sinlgePoint: { xAxisPoint: string | number; chartData: IVSChartDataPoint[] }) =>
        sinlgePoint.xAxisPoint === xAxisPoint,
    );
    this.setState({
      refSelected: groupRef.refElement,
      isCalloutVisible: true,
      YValueHover: found!.chartData,
      hoverXValue: xAxisPoint,
      stackCalloutProps: found!,
    });
  };

  private _handleMouseOut = (): void => {
    this.setState({
      isCalloutVisible: false,
    });
  };

  private _redirectToUrl = (): void => {
    this.props.href ? (window.location.href = this.props.href) : '';
  };

  private _getYMax(dataset: IDataPoint[]) {
    return Math.max(d3Max(dataset, (point: IDataPoint) => point.y)!, this.props.yMaxValue || 0);
  }

  private _createBar = (
    xBarScale: NumericScale | StringScale,
    yBarScale: NumericScale,
    containerHeight: number,
  ): JSX.Element[] => {
    const { barGapMax = 0, barCornerRadius = 0 } = this.props;

    const bars = this._points.map((singleChartData: IVerticalStackedChartProps, indexNumber: number) => {
      let yPoint = containerHeight - this.margins.bottom!;
      const isCalloutForStack = this.props.isCalloutForStack || false;
      const xPoint = xBarScale(this._isNumeric ? (singleChartData.xAxisPoint as number) : indexNumber);

      // Removing datapoints with zero data
      const nonZeroBars = singleChartData.chartData.filter(point => point.data > 0);

      // When displaying gaps between the bars, the height of each bar is
      // adjusted so that the total of all bars is not changed by the gaps
      const totalData = nonZeroBars.reduce((iter, value) => iter + value.data, 0);
      const totalHeight = yBarScale(totalData);
      const spaces = barGapMax && nonZeroBars.length - 1;
      const spaceHeight = spaces && Math.max(barGapMin, Math.min(barGapMax, (totalHeight * barGapMultiplier) / spaces));
      const heightValueRatio = (totalHeight - spaceHeight * spaces) / totalData;

      if (heightValueRatio < 0) {
        return undefined;
      }

      const singleBar = nonZeroBars.map((point: IVSChartDataPoint, index: number) => {
        const color = point.color ? point.color : this._colors[index];
        const ref: IRefArrayData = {};

        let shouldHighlight = true;
        if (this.state.isLegendHovered || this.state.isLegendSelected) {
          shouldHighlight = this.state.selectedLegendTitle === point.legend;
        }
        const classNames = getClassNames(this.props.styles!, {
          theme: this.props.theme!,
          shouldHighlight: shouldHighlight,
          href: this.props.href,
        });
        const rectFocusProps = !isCalloutForStack && {
          'data-is-focusable': true,
          'aria-labelledby': this._calloutId,
          onMouseOver: this._onRectHover.bind(this, singleChartData.xAxisPoint, point),
          onMouseMove: this._onRectHover.bind(this, singleChartData.xAxisPoint, point),
          onMouseLeave: this._handleMouseOut,
          onFocus: this._onRectFocus.bind(this, point, singleChartData.xAxisPoint, color, ref),
          onBlur: this._handleMouseOut,
          onClick: this._redirectToUrl,
        };

        const barHeight = heightValueRatio * point.data;
        yPoint = yPoint - barHeight - (index ? spaceHeight : 0);

        // If set, apply the corner radius to the top of the final bar
        if (barCornerRadius && barHeight > barCornerRadius && index === nonZeroBars.length - 1) {
          return (
            <path
              key={index + indexNumber}
              className={classNames.opacityChangeOnHover}
              d={`
                M ${xPoint} ${yPoint + barCornerRadius}
                a ${barCornerRadius} ${barCornerRadius} 0 0 1 ${barCornerRadius} ${-barCornerRadius}
                h ${this._barWidth - 2 * barCornerRadius}
                a ${barCornerRadius} ${barCornerRadius} 0 0 1 ${barCornerRadius} ${barCornerRadius}
                v ${barHeight - barCornerRadius}
                h ${-this._barWidth}
                z
              `}
              fill={color}
              ref={e => (ref.refElement = e)}
              {...rectFocusProps}
            />
          );
        }

        return (
          <rect
            key={index + indexNumber}
            className={classNames.opacityChangeOnHover}
            x={xPoint}
            y={yPoint}
            width={this._barWidth}
            height={barHeight}
            fill={color}
            ref={e => (ref.refElement = e)}
            {...rectFocusProps}
          />
        );
      });
      const groupRef: IRefArrayData = {};
      const stackFocusProps = isCalloutForStack && {
        'data-is-focusable': true,
        onMouseOver: this._onStackHover.bind(this, singleChartData.xAxisPoint),
        onMouseMove: this._onStackHover.bind(this, singleChartData.xAxisPoint),
        onMouseLeave: this._handleMouseOut,
        onFocus: this._onStackFocus.bind(this, singleChartData.xAxisPoint, groupRef),
        onBlur: this._handleMouseOut,
        onClick: this._redirectToUrl,
      };
      return (
        <g key={indexNumber} id={`${indexNumber}-singleBar`} ref={e => (groupRef.refElement = e)} {...stackFocusProps}>
          {singleBar}
        </g>
      );
    });

    return bars.filter((bar): bar is JSX.Element => !!bar);
  };

  private _createNumericBars = (containerHeight: number, containerWidth: number): JSX.Element[] => {
    const yMax = this._getYMax(this._dataset);
    const xMax = d3Max(this._dataset, (point: IDataPoint) => point.x as number)!;

    const xBarScale = d3ScaleLinear()
      .domain(this._isRtl ? [xMax, 0] : [0, xMax])
      .nice()
      .range([this.margins.left!, containerWidth - this.margins.right! - this._barWidth]);
    const yBarScale = d3ScaleLinear()
      .domain([0, yMax])
      .range([0, containerHeight - this.margins.bottom! - this.margins.top!]);

    return this._createBar(xBarScale, yBarScale, containerHeight);
  };

  private _createStringBars = (containerHeight: number, containerWidth: number): JSX.Element[] => {
    const yMax = this._getYMax(this._dataset);
    const endpointDistance = 0.5 * ((containerWidth - this.margins.right!) / this._dataset.length);
    const xBarScale = d3ScaleLinear()
      .domain(this._isRtl ? [this._dataset.length - 1, 0] : [0, this._dataset.length - 1])
      .range([
        this.margins.left! + endpointDistance - 0.5 * this._barWidth,
        containerWidth - this.margins.right! - endpointDistance - 0.5 * this._barWidth,
      ]);
    const yBarScale = d3ScaleLinear()
      .domain([0, yMax])
      .range([0, containerHeight - this.margins.bottom! - this.margins.top!]);

    return this._createBar(xBarScale, yBarScale, containerHeight);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _getGraphData = (xScale: any, yScale: NumericAxis, containerHeight: number, containerWidth: number) => {
    return (this._bars = this._isNumeric
      ? this._createNumericBars(containerHeight, containerWidth)
      : this._createStringBars(containerHeight, containerWidth));
  };
}
