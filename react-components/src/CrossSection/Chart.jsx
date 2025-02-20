import React from "react";
import { CIQ } from "chartiq/js/standard";
import "chartiq/js/components";
import "chartiq/plugins/crosssection/core";
import "chartiq/plugins/crosssection/datepicker";
import "chartiq/plugins/crosssection/ui";
import "chartiq/plugins/crosssection/timelineDateSelector";

import "chartiq/plugins/crosssection/crosssection.css";
import "chartiq/plugins/crosssection/datepicker.css";

import ChartTemplate from "./Template";

import "chartiq/css/normalize.css";
import "chartiq/css/stx-chart.css";
import "chartiq/css/chartiq.css";

import { getCustomConfig } from "./resources"; // ChartIQ library resources

export { CIQ };

/**
 * An example of a cross section chart for non time series data.
 *
 * @class CrossSection
 * @export
 * @extends {React.Component}
 */
export default class TermStructure extends React.Component {
	/**
	 * @constructor
	 * @param {object} [props] React props
	 * @param {object} [props.config] Configuration used for the chart.
	 * @param {object} [props.resources] Object of resources passed into configuration to be applied
	 * @param {CrossSection~chartInitialized} [props.chartInitialized] Callback that fires when the chart is created
	 */
	constructor(props) {
		super(props);
		const { config, resources } = props;

		this.container = React.createRef();

		const configObj = getCustomConfig({ resources });
		CIQ.extend(configObj, config);
		this.config = configObj;

		this.state = {
			stx: null,
			UIContext: null
		};
	}

	componentDidMount() {
		const container = this.container.current;
		const { chartInitialized } = this.props;
		const { config } = this;

		window.setTimeout(() => {
			const uiContext = new CIQ.UI.Chart().createChartAndUI({
				container,
				config
			});
			const chartEngine = uiContext.stx;

			this.setState({ stx: chartEngine, UIContext: uiContext });

			if (chartInitialized) {
				chartInitialized({ chartEngine, uiContext });
			}
		}, 0);
	}

	componentWillUnmount() {
		// Destroy the ChartEngine instance when unloading the component.
		// This will stop internal processes such as quotefeed polling.
		const { stx } = this.state;
		stx.destroy();
		stx.draw = () => {};
	}

	render() {
		return (
			<cq-context ref={this.container}>
				{this.props.children || <ChartTemplate />}
			</cq-context>
		);
	}
}

/**
 * @callback CrossSection~chartInitialized
 * @param {CIQ.ChartEngine} chartEngine
 * @param {CIQ.UI.Context} uiContext
 */
