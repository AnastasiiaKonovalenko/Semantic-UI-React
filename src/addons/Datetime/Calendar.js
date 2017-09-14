import _ from 'lodash/fp'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Days from './Days'
import Months from './Months'
import Years from './Years'
import Hours from './Hours'
import Minutes from './Minutes'

import {
  customPropTypes,
  dateUtils,
  META,
} from '../../lib'

const style = {
  float: 'left',    // for side-by-side calendar ranges
  width: '20em',
}

/**
 * A Calendar is used to display and select both dates and times.
 *
 * @see Datetime
 */
export default class Calendar extends Component {
  static _meta = {
    name: 'Calendar',
    parent: 'Datetime',
    type: META.TYPES.MODULE,
  }

  static propTypes = {
    /**
     * Formats the date string in the input and calendar.
     * A function that receives a date argument and returns a formatted date
     * @param {date} - A date object.
     */
    dateFormatter: PropTypes.func,

    /** An array of dates that should be marked disabled in the calendar. */
    disabledDates: PropTypes.arrayOf(customPropTypes.DateValue),

    /** First day of the week (Sunday = 0, Monday = 1). */
    firstDayOfWeek: PropTypes.number,

    /**
     * Formats an hour for display in the hour selection.
     * A function that receives a date argument and returns a formatted
     * rounded hour.
     */
    hourFormatter: PropTypes.func,

    /** Current calendar mode. */
    mode: PropTypes.oneOf(['minute', 'hour', 'day', 'month', 'year']),

    /**
     * Called when the user changes the value.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props and proposed value.
     * @param {object} data.value - The proposed new value.
     */
    onChange: PropTypes.func,

    /** Display future or past months or years. */
    page: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    /** Dates until or at selectionEnd are marked as selected. */
    selectionEnd: customPropTypes.DateValue,

    /** Dates at or after selectionStart are marked as selected. */
    selectionStart: customPropTypes.DateValue,

    /** Enables time selection. */
    time: PropTypes.bool,

    /**
     * Formats the time string in the input and calendar.
     * The function receives a date arguments and should return a string
     * formatted time.
     * @param {date} - A date object.
     */
    timeFormatter: PropTypes.func,

    /** Current value as a Date object or a string that can be parsed into one. */
    value: customPropTypes.DateValue,
  }

  static defaultProps = {
    firstDayOfWeek: 1,
    date: true,
    time: true,
    mode: 'day',
    value: new Date(),
    dateFormatter: dateUtils.defaultDateFormatter,
    timeFormatter: dateUtils.defaultTimeFormatter,
    hourFormatter: dateUtils.defaultHourFormatter,
  }

  handleChange = (e, { value, mode }) => {
    _.invokeArgs('onChange', [e, { ...this.props, value, mode }], this.props)
  }

  handleDayChange = (e, { value }) => {
    const { time } = this.props
    this.handleChange(e, { value, mode: time ? 'hour' : null })
  }

  handleMonthChange = (e, { value }) => {
    this.handleChange(e, { value, mode: 'day' })
  }

  handleYearChange = (e, { value }) => {
    this.handleChange(e, { value, mode: 'month' })
  }

  handleHourChange = (e, { value }) => {
    this.handleChange(e, { value, mode: 'minute' })
  }

  handleMinuteChange = (e, { value }) => {
    this.handleChange(e, { value, mode: null })
  }

  renderBody() {
    const {
      firstDayOfWeek,
      timeFormatter,
      hourFormatter,
      disabledDates,
      mode,
      value,
      selectionStart,
      selectionEnd,
    } = this.props

    if (mode === 'day') {
      return (
        <Days
          firstDayOfWeek={firstDayOfWeek}
          onChange={this.handleDayChange}
          value={value}
          selectionStart={selectionStart}
          selectionEnd={selectionEnd}
          disabledDates={disabledDates}
        />
      )
    }

    if (mode === 'month') {
      return <Months onChange={this.handleMonthChange} value={value} />
    }

    if (mode === 'year') {
      return <Years onChange={this.handleYearChange} value={value} />
    }

    if (mode === 'hour') {
      return <Hours onChange={this.handleHourChange} formatter={hourFormatter} value={value} />
    }

    if (mode === 'minute') {
      return <Minutes onChange={this.handleMinuteChange} formatter={timeFormatter} value={value} />
    }
  }

  render() {
    return (
      <div style={style}>
        {this.renderBody()}
      </div>
    )
  }
}
