import { connect } from 'react-redux'
import Filter from '../../components/Filter'
import { setVisibilityFilter } from '../../actionsCreator'

const mapStateToProps = (state, ownProps) => ({
  active: state.visibilityFilter === ownProps.filter
})

const mapDidpatchToProps = (dispatch, ownProps) => ({
  setVisibiltyFilter: () => {
    dispatch(setVisibilityFilter(ownProps.filter))
  }
})

export default connect(mapStateToProps, mapDidpatchToProps)(Filter)