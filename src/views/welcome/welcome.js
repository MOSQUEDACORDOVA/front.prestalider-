
import { bindable } from 'aurelia'; 
import Chart from 'chart.js/auto';
export class Welcome {
    
    chartData = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
        values: [10, 20, 15, 25, 30],
        label: 'Ventas Mensuales'
      };
}

export class BarChart {
    @bindable data;
    chart;
    chartCanvas;
    
    attached() {
      console.log('BarChart component attached'); // <-- Agregar esto
      if (this.data) {
        this.renderChart();
      }
    }
  
    dataChanged() {
      console.log('Data changed:', this.data); // <-- Agregar esto
      
      if (this.chart) {
        this.chart.destroy();
      }
      if (this.data) {
        this.renderChart();
      }
    }
    renderChart() {
      console.log('Rendering chart', this.chartCanvas); // <-- Agregar esto
      
      if (!this.chartCanvas) {
        console.warn('chartCanvas is not available');
        return;
      }
    
      const ctx = this.chartCanvas.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.data.labels || [],
          datasets: [{
            label: this.data.label || 'Datos',
            data: this.data.values || [],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
  }