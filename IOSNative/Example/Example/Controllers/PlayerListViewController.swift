//
//  PlayerListViewController.swift
//  Example
//
//  Created by APPLE on 6/27/17.
//  Copyright © 2017 Viral. All rights reserved.
//

import UIKit
import IGListKit

class PlayerListViewController: UIViewController {
    var object: SeasonItem?
    var data = [PlayerItem]() {
        didSet {
            self.adapter.reloadData(completion: nil)
        }
    }
    @IBOutlet weak var collectionView: UICollectionView!
    lazy var adapter: ListAdapter = {
        return ListAdapter(updater: ListAdapterUpdater(), viewController: self)
    }()
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        adapter.collectionView = collectionView
        adapter.dataSource = self
        let barbutton = UIBarButtonItem(barButtonSystemItem: .refresh, target: self, action: #selector(PlayerListViewController.callRefresh))
        self.navigationItem.rightBarButtonItem = barbutton
        callWebserviceSeasonPlayers()
    }
    func callRefresh() {
        callWebserviceSeasonPlayers()
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
extension PlayerListViewController: ListAdapterDataSource {
    // MARK: ListAdapterDataSource
    
    func objects(for listAdapter: ListAdapter) -> [ListDiffable] {
        return [object!.season as ListDiffable]
    }
    
    func listAdapter(_ listAdapter: ListAdapter, sectionControllerFor object: Any) -> ListSectionController {
        let section = PlayerSectionController()
        section.parent = self
        section.items = data
        return section
    }
    
    func emptyView(for listAdapter: ListAdapter) -> UIView? {
        return nil
    }
}
