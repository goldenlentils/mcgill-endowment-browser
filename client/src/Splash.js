import React from 'react'
import { Chart } from 'react-google-charts'
import Content from './Content'
import { formatCurrency } from './util'

function SummaryColumnChart (props) {
  const { views } = props

  const header = ['Country', 'Canadian', 'US', 'International']
  const data = [header].concat(views.map(v =>
    [v.name, v.origin.can, v.origin.us, v.origin.intl]
  ))

  const options = {
    title: 'Investment total by category and asset origin',
    legend: 'bottom',
    isStacked: true
  }

  const loader = (
    <div>
      <i className="fas fa-fw fa-circle-notch fa-spin" />
      {' Rendering chart...'}
    </div>
  )

  return (
    <Chart
      chartType="ColumnChart"
      data={data}
      width="100%"
      options={options}
      loader={loader}
    />
  )
}

function SummaryPieChart (props) {
  const { all, views } = props

  const other = {
    name: 'Other',
    totalCompanies: all.totalCompanies - views.reduce((acc, v) =>
      acc + v.totalCompanies, 0)
  }

  const header = ['Category', 'Value']
  const body = views.concat([other]).map(v => [v.name, v.totalCompanies])
  const data = [header].concat(body)

  const options = {
    title: 'Investment total by category, excluding bonds and funds',
    sliceVisibilityThreshold: 0
  }

  const loader = (
    <div>
      <i className="fas fa-fw fa-circle-notch fa-spin" />
      {' Rendering chart...'}
    </div>
  )

  return (
    <Chart
      chartType="PieChart"
      data={data}
      width="100%"
      options={options}
      loader={loader}
    />
  )
}

function SplashContent (props) {
  const { summary, init, onCompanyClick } = props

  if (init.readyState === 'REQUEST_UNSENT' ||
    init.readyState === 'REQUEST_LOADING') {
    return (
      <div>
        <i className="fas fa-fw fa-circle-notch fa-spin" />
        {' Loading...'}
      </div>
    )
  }

  if (init.readyState === 'REQUEST_FAILED') {
    return (
      <div>
        <i className="fas fa-fw fa-times" />
        {' Error: ' + init.error}
      </div>
    )
  }

  const all = summary[0]
  const views = summary.slice(1)

  return (
    <div>
      <p>Here is an overview of the endowment:</p>
      <SummaryColumnChart views={views} />
      <p>The approximate total value of McGill's endowment is <span className="bold-value">{formatCurrency(all.total)}</span>, excluding cash-equivalent assets such as foreign currency and alternative (non-stock) investments such as real estate.</p>
      <ul>
        <li>25% of this amount is invested in fixed-income securities (bonds).</li>
        <li>33% of this amount is invested in mutual funds.</li>
      </ul>
      <SummaryPieChart all={all} views={views} />
      <p>Peruse the categories in the sidebar, or take a look at one of the following companies:</p>
      <button className="pure-button" onClick={() => onCompanyClick('shell')}>shell</button>
      {' '}
      <button className="pure-button" onClick={() => onCompanyClick('bhp')}>bhp</button>
      {' '}
      <button className="pure-button" onClick={() => onCompanyClick('rio tinto')}>rio tinto</button>
      <p>Investment data current as of March 31, 2019.</p>
      <p><small>The information presented on this website is the result of both manual and automated data processing that includes data from third-party sources. Despite best efforts, the authors do not guarantee the correctness, reliability, and completeness of the information provided.</small></p>
    </div>
  )
}

function Splash (props) {
  return (
    <Content>
      <p><strong className="secondary-font">mcgillinvests.in</strong> is a tool to explore McGill University's investment data, obtained by Divest McGill via Access to Information requests.</p>
      <p>We have organized the endowment into several categories of interest, bringing into focus the investments that we do not consider socially and environmentally responsible. Contextual information about each company and links to further research are provided where available.</p>
      <SplashContent {...props} />
    </Content>
  )
}

export default Splash
