import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import * as d3 from 'd3';

function CoinChart({ coin, data }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      const svg = d3.select(ref.current);
      const margin = 200;
      const width = ref.current.clientWidth - margin;
      const height = svg.attr('height') - margin;

      svg.selectAll('*').remove();

      // title
      svg
        .append('text')
        .attr('transform', 'translate(100,0)')
        .attr('x', 50)
        .attr('y', 50)
        .attr('font-size', '30px')
        .text(coin + ' price');

      const xScale = d3.scaleBand().range([0, width]).padding(0.5);
      const yScale = d3.scaleLinear().range([height, 0]);

      // axis
      const g = svg
        .append('g')
        .attr('transform', 'translate(' + 100 + ',' + 100 + ')');

      const min = d3.min(data, (d) => d.value);
      const max = d3.max(data, (d) => d.value);
      const threshold = (max - min) / 5;

      xScale.domain(data.map((d) => d.key));
      yScale.domain([Number(min) - threshold, Number(max) + threshold]);

      // x legend
      g.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(xScale))
        .append('text')
        .attr('y', height - 260)
        .attr('x', width - 80)
        .attr('text-anchor', 'end')
        .attr('stroke', 'teal')
        .attr('fill', '#58c9c9')
        .attr('font-size', '1.5em')
        .text('Date');

      // y legend
      g.append('g')
        .call(
          d3
            .axisLeft(yScale)
            .tickFormat((d) => '€' + d)
            .ticks(10)
        )
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '-4em')
        .attr('dx', '-0.5em')
        .attr('text-anchor', 'end')
        .attr('stroke', 'teal')
        .attr('fill', '#58c9c9')
        .attr('font-size', '1.5em')
        .text('Price');

      // bars
      g.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', xScale.bandwidth())
        .attr('x', (d) => xScale(d.key))
        .attr('y', () => yScale(min - threshold))
        .attr('height', () => 0)
        .transition()
        .duration(500)
        .attr('y', (d) => yScale(d.value))
        .attr('height', (d) => {
          return height - yScale(d.value);
        })
        .delay(function (_, i) {
          return i * 80;
        });
    }
  }, [ref, data, coin]);

  return <svg ref={ref} width="100%" height="500" />;
}

CoinChart.propTypes = {
  coin: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired
  ).isRequired,
};

export default CoinChart;
