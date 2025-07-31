//Bactest
export const BACKTEST_HEADER_TOOLTIP =
  "Backtesting simulates the execution of a strategy’s defined stages over historical stock market data for a specified time period and investment amount. It provides insights into the strategy’s performance, including metrics like capital growth, annual returns, maximum drawdown, and other key indicators to help users evaluate how well the strategy aligns with their investment goals.";

export const RUNBACKTEST_DISABLE_TOOLTIP =
  "The strategy should be in completed state to run a backtest";

export const PLOT_GRAPH_TOOLTIP = "Graphs to visualize backtest results";

export const CAPTITAL_DESC =
  "Capital Graph plots current total account value, uninvested capital and net profit v/s time";

export const PARAMETERS_DESC =
  "Parameter Graph plots various performance metrices such as Sharpe Ratio, SQN, Expectancy v/s time";
export const DRAWDOWN_DESC =
  "Drawdown Graph plots % drawdown in total capital v/s time";
export const PROFITS_DESC =
  "Profit Graph plots Annual % Profit, Average % Profit, and Accuracy v/s time";
export const AVG1R_DESC = "Avg1r Graph plots average risk v/s time";
export const COMPARE_WITH_INDEX_DESC =
  "Compare With Index plots Account % growth in relation to Nifty and NiftyMidCap100 change v/s time";
export const OPEN_TRADES_DESC =
  "Open Trades Graph plots number of open trades v/s time";
export const TOTAL_TRADES_DESC =
  "Total Trades Graph plots number of total trades v/s time";
export const DURATION_DESC =
  "Durations Graph plots average holding duration of the trades v/s time";
export const SYMBOL_DESC =
  "Symbol Graph plots the closing price of chosen stock symbol along with its buy and sell signals v/s time";
//Deploy
export const DEPLOY_HEADER_TOOLTIP =
  "Deploy enables users to activate a strategy for live capital investment. To deploy, users specify the investment amount, the brokerage account for trade execution, and a deployment date—which can be today’s date or a past date. Once deployed, the platform automatically runs the strategy at the end of each trading day and may generate trade signals (buy/sell), including the recommended quantity of shares to transact.";

export const STRATEGY_TOOLTIP_TITLE =
  "A trading strategy is a systematic plan that outlines step-by-step actions to leverage market opportunities while managing risks. It includes clear entry, execution, and exit points tailored to achieve specific financial objectives.";

export const FUNCTION_TOOLTIP_TITLE =
  "Functions are the building blocks of various rules in a strategy. They are written in a specific language and may have input arguments. Many functions are already provided by the system. Users can write their own functions as well";
//Stock bundle tooltips and subtitles
export const STOCK_BUNDLE_TITLE = "Stock Bundle";
export const STOCK_BUNDLE_DESCRIPTION =
  "Stock Bundle is a combination of static list and/or dynamic list of stocks selected for trade evaluation";
export const STOCK_BUNDLE_CONFIG_TITLE =
  "Define the input parameters for selected stock filter";
export const STOCK_BUNDLE_BUTTON_TITLE = "Create Your Own Stock Filter ";

export const STOCK_SUB_TITLE = "Select Stock Filters";
// Trade rule tooltips and subtitles
export const TRADE_RULE_TITLE = "Trade Rule";
export const TRADE_RULE_DESCRIPTION =
  "Trade Rule determines buy or sell condition for a stock based on technical indicators";
export const TRADE_RULE_CONFIG_TITLE =
  "Define the input parameters for selected trade rule";
export const TRADE_RULE_BUTTON_TITLE = "Create Your Own Trade Rule ";
export const TRADE_RULE_SUB_TITLE = "Select Trade Rule";

// Market rule tooltips and subtitles
export const MARKET_ENTRY_TITLE = "Market Entry";
export const MARKET_ENTRY_DESCRIPTION =
  "Market Entry Rule determines when overall market is favorable to invest";
export const MARKET_ENTRY_CONFIG_TITLE =
  "Define the input parameters for selected market entry";
export const MARKET_ENTRY_BUTTON_TITLE = "Create Your Own Market Entry Rule ";

export const MARKET_ENTRY_SUB_TITLE = "Select Market Entry ";

export const MARKET_EXIT_TITLE = "Market Exit";
export const MARKET_EXIT_DESCRIPTION =
  "Market Exit Rule determines when overall market is not favorable to invest";
export const MARKET_EXIT_CONFIG_TITLE =
  "Define the input parameters for selected market exit";
export const MARKET_EXIT_BUTTON_TITLE = "Create Your Own Market Exit Rule ";
export const MARKET_EXIT_SUB_TITLE = "Select Market Exit";

// Stock rule tooltips and subtitles
export const STOCK_ENTRY_TITLE = "Stock Entry";
export const STOCK_ENTRY_DESCRIPTION =
  "Stock Entry Rule defines one or more conditions to consider a stock for potential investment";
export const STOCK_ENTRY_CONFIG_TITLE =
  "Define the input parameters for selected stock entry";
export const STOCK_ENTRY_BUTTON_TITLE = "Create Your Own Stock Entry Rule ";
export const STOCK_ENTRY_SUB_TITLE = "Select Stock Entry";

export const STOCK_EXIT_TITLE = "Stock Exit";
export const STOCK_EXIT_DESCRIPTION =
  "Stock Exit Rule defines one or more conditions to not consider a stock for investment";
export const STOCK_EXIT_CONFIG_TITLE =
  "Define the input parameters for selected stock exit";
export const STOCK_EXIT_BUTTON_TITLE = "Create Your Own Stock Exit Rule ";
export const STOCK_EXIT_SUB_TITLE = "Select Stock Exit";

// Trade sequence tooltips and subtitles
export const TRADE_SEQUENCE_TITLE = "Trade Sequence";
export const TRADE_SEQUENCE__DESCRIPTION =
  "Trade Sequence Rule defines one or more conditions to determine order in which available capital is allocated to candidate stocks";
export const TRADE_SEQUENCE_CONFIG_TITLE =
  "Define the input parameters for selected trade sequence";
export const TRADE_SEQUENCE_BUTTON_TITLE =
  "Create Your Own Trade Sequence Rule ";
export const TRADE_SEQUENCE_SUB_TITLE = "Select Trade Sequence";

// Portfolio sizing tooltips and subtitles
export const PSIZINING_TITLE = "Portfolio Sizing";
export const PSIZINING__DESCRIPTION =
  "Portfolio Sizing Rule determines how much capital to allocate from available capital to a given stock based on risk";
export const PSIZINING_CONFIG_TITLE =
  "Define the input parameters for selected portfolio sizining";
export const PSIZINING_BUTTON_TITLE = "Create Your Own Portfolio Sizing Rule ";
export const PSIZINING_SUB_TITLE = "Select Portfolio Sizing";
export const PSIZINING_SUBHEADER_TITLE = "Portfolio Details";
export const PSIZINING_SUBHEADER_DESC = "Enter the details for Portfolio risk";
export const PSIZINING_TOOLTIP_TITLE_1 = "Portfolio Risk";
export const PSIZINING_TOOLTIP_TITLE_2 = "Max Investment Per Trade";
export const PSIZINING_TOOLTIP_TITLE_3 = "Min Investment Per Trade";

export const CREATE_STRATEGY_BTN_TOOLTIP =
  "Please complete all the pending steps to create a Strategy. Save as draft to complete it later";

export const STRATEGY_DEFINITION_TAB_TOOLTIP =
  "Strategy Definition tab is disabled as all Versions are selected. Select a version to view definition of that version";

export const STRATEGY_DEPLOY_BTN_TOOLTIP =
  "The strategy should have at least one backtest to deploy a strategy";

export const DEPLOY_DISABLE_TOOLTIP =
  "The strategy should be in completed state and should have at least one backtest to deploy a strategy";
export const DEPLOY_DISABLE =
  "The strategy should have at least one backtest to deploy a strategy";

//Functions tooltips and subtitles
export const FUNCTION_TITLE = "Create Function";
export const FUNCTION_TITLE_BUTTON = "Create Function";
export const FUNCTION_TITLE_TOOLTIP = "Create Function";

export const FUNCTION_SUB_TITLE = "Function Definition";
export const FUNCTION_SUB_TITLE_BUTTON = "Verify";
export const FUNCTION_SUB_TITLE_TOOLTIP =
  "Defines the function in terms of its code and arguments";

export const FUNCTION_TYPE_TITLE = "Type of Function";
export const FUNCTION_TYPE_TOOLTIP =
  "Identifies type of a function as Filter Rule/Trade Rule/Stock Entry & Exit/Global Entry & Exit/Trade Sequence/Portfolio Sizing/Utility rule";
export const FUNCTION_SUBTYPE_TITLE = "Sub Type";
export const FUNCTION_SUBTYPE_TOOLTIP =
  "Identifies Sub-type of a function. Sub-Type depends on Type of the function";

//verifymodal tooltips and subtitles
export const VERIFY_TITLE = "Verify Function";
export const VERIFY_SUB_TITLE = "Verify Function";
export const VERIFY_SUB_TITLE_TOOLTIP = "Verify Function";

export const VERIFY_STOCK_TITLE = "Verify on Stock";
export const VERIFY_STOCK_TOOLTIP = "Verify on Stock";

export const PrimaryYAxis = "Primary Y-Axis";
export const SecondaryYAxis = "Secondary Y-Axis";
export const TimelineAxis = "Timeline";

export const ARGUMENTS_TOOLTIP = "Arguments";

export const PRIMITIVES_TOOLTIP =
  "Primitives are system defined low level functions that are useful to create higher level functions of various types (e.g. Filter Rule or Trade Rule). A special class of Primitives, called Account Rules, are named with an underscore in the end (for e.g. curprofit_";
export const FUNCTION_TOOLTIP = "Function";
export const IDENTIFIER_TOOLTIP = "Identifier";

export const YET_TO_DO_MSG =  "Platform will populate price and other data for this trade at end of the day";
