import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Grid from '@material-ui/core/Grid';
import {withIface} from 'metadata-redux';
import {item_props} from '../App/menu';
import Builder from '../Builder';
import Props from '../Props/Main';
import withStyles, {WorkPlace} from '../App/WorkPlace';

class Furn1 extends WorkPlace {

  onBarcode(barcode) {
    super.onBarcode(barcode)
      .then((bar) => {
        if(!bar) {
          return;
        }
        const {project} = this.editor;
        const {cnstr, ox} = bar;
        project.load(ox, {custom_lines: false, mosquito: false})
          .then(() => {
            const contour = project.getItem({cnstr});
            if(contour) {
              // рисуем текущий слой
              project.draw_fragment({elm: -cnstr, faltz: 'faltz'});
              // прячем заполнения
              contour.glasses(true);
              // вписываем в размер экрана
              project.zoom_fit();
              this.setState(bar);
            }
          });
      })
      .catch(({message}) => {
        const {ox} = this.state;
        if(ox && ox.unload) {
          ox.unload();
        }
        this.editor.project.clear();
        this.setState({ox: {}});
      });
  }

  render() {
    const {classes} = this.props;
    const iprops = item_props();
    return <Grid container>
      <Helmet title={iprops.text}>
        <meta name="description" content={iprops.title}/>
      </Helmet>
      <Grid item sm={12} lg={8} className={classes.workplace}>
        <Builder registerChild={this.registerEditor}/>
      </Grid>
      <Grid item sm={12} lg={4} className={classes.props}>
        <Props {...this.state} show_spec={false}/>
      </Grid>
    </Grid>;
  }
}

Furn1.propTypes = {
  handleIfaceState: PropTypes.func.isRequired,
  title: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

export default withStyles(withIface(Furn1));
